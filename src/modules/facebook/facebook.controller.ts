import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../utils/logger';
import {
  CreateLeadgenSubscriptionBody,
  CreateLeadgenSubscriptionQuery,
  DeleteLeadgenSubscriptionBody,
  EditLeadgenSubscriptionBody,
  GetFormQuestionsQuery,
  GetNewLeadDataBody,
  GetPageFormsQueryType,
  GetSubscriptionQuery,
  GetUserPagesQueryType,
  WebhookChallengeQuery,
} from './facebook.schema';
import {
  convertArrayToObject,
  createFacebookLead,
  createFacebookSubscription,
  deleteSubscriptionFromFacebook,
  findAndDeleteSubscription,
  findAndUpdateSubscriptionQuestions,
  findFacebookLeadgenInfo,
  findSubscription,
  getDolphinCampaignQuestions,
  getFormQuestions,
  getFullLeadData,
  getLongLivedPageAccessToken,
  getPageForms,
  getUserPages,
  sendLeadToDolphin,
  subscribePageToApp,
} from './facebook.service';

export async function getNewLeadDataHandler(
  request: FastifyRequest<{ Body: GetNewLeadDataBody }>,
  reply: FastifyReply
) {
  try {
    const form_id = request.body.entry[0].changes[0].value.form_id;
    const page_id = request.body.entry[0].changes[0].value.page_id;
    const leadId = request.body.entry[0].changes[0].value.leadgen_id;
    // getFullLeadInfo
    const leadInfo = await findFacebookLeadgenInfo({ form_id, page_id });

    if (!leadInfo)
      return reply.code(400).send({
        message: "Error can't find lead with provided formId & pageId",
      });

    const { field_data, id, ...rest } = await getFullLeadData(
      leadId,
      leadInfo.page_access_token
    );

    // Iterate over the leadinfo questions and build a request body with the required fields
    const leadBody = convertArrayToObject(leadInfo.questions, field_data);

    // SEND THE LEAD TO DOLPHIN Leads api
    await sendLeadToDolphin({
      body: {
        ...leadBody,
        companyId: leadInfo.companyId,
        campaignId: leadInfo.campaignId,
        url: 'https://www.facebook.com/',
        formSubmittedDate: new Date().toISOString(),
      },
    });
    // Save the lead as a backup to dolphin leads api
    await createFacebookLead({
      data: field_data,
      lead_id: id,
      ...rest,
      form_id,
    });
    return reply.code(StatusCodes.OK).send('OK');
  } catch (error) {
    logger.error(error, 'getNewLeadDataHandler: error getting new lead');
    return reply.code(400).send({ message: 'Error getting new lead' });
  }
}

export async function createLeadgenSubscriptionHandler(
  request: FastifyRequest<{
    Querystring: CreateLeadgenSubscriptionQuery;
    Body: CreateLeadgenSubscriptionBody;
  }>,
  reply: FastifyReply
) {
  try {
    // TODO get the campaign questions,
    const [dolphinQuestions, error] = await getDolphinCampaignQuestions(
      request.body
    );

    if (error || !dolphinQuestions) {
      return reply
        .code(StatusCodes.BAD_REQUEST)
        .send(error || 'No questions defined in this campaign.');
    }

    const predefinedFieldArray = request.body.questions.map(
      (q) => q.predefinedField
    );

    // Check if the question and predefined fields are with the same name
    const isAllQuestionsDefined = dolphinQuestions.every((q) =>
      predefinedFieldArray.includes(q.predefinedField)
    );

    if (!isAllQuestionsDefined) {
      return reply
        .code(StatusCodes.BAD_REQUEST)
        .send('Every questions field must have a matching predefined field');
    }

    //subscribing page to app
    const data = await subscribePageToApp(request.query);

    // get Long lived page token
    if (!data.success) throw new Error('Failed to Subscribe to page');

    const longLivedPageToken = await getLongLivedPageAccessToken(request.query);

    const facebook = await createFacebookSubscription({
      ...request.query,
      ...request.body,
      page_access_token: longLivedPageToken,
    });

    return reply.code(200).send(facebook);
  } catch (error) {
    logger.error(
      error,
      'createLeadgenSubscriptionHandler: error creating leadgen subscription'
    );
    return reply
      .code(400)
      .send({ message: 'Error creating leadgen subscription', error });
  }
}

//
export function webhookChallengeHandler(
  request: FastifyRequest<{ Querystring: WebhookChallengeQuery }>,
  reply: FastifyReply
) {
  try {
    if (request.query['hub.verify_token'] === 'CUSTOM_WEBHOOK_VERIFY_TOKEN') {
      return reply.send(request.query['hub.challenge']);
    }
  } catch (error) {
    logger.error(error, 'webhookChallengeHandler: error solving challenge');
    return reply.code(400).send({ message: 'Error solving challenge' });
  }
}

export async function getUserPagesHandler(
  request: FastifyRequest<{ Querystring: GetUserPagesQueryType }>,
  reply: FastifyReply
) {
  try {
    const pages = await getUserPages(request.query);
    return reply.code(200).send(pages.data);
  } catch (error) {
    logger.error(error, 'getUserPagesHandler: error getting user pages');
    return reply.code(400).send({ message: 'Error getting user pages' });
  }
}

export async function getPageFormsHandler(
  request: FastifyRequest<{ Querystring: GetPageFormsQueryType }>,
  reply: FastifyReply
) {
  try {
    const forms = await getPageForms(request.query);
    return reply.code(200).send(forms.data);
  } catch (error) {
    logger.error(error, 'getPageFormsHandler: error getting page forms');
    return reply.code(400).send({ message: 'Error getting page forms' });
  }
}

export async function getFormQuestionsHandler(
  request: FastifyRequest<{ Querystring: GetFormQuestionsQuery }>,
  reply: FastifyReply
) {
  try {
    const [data, error] = await getFormQuestions(request.query);

    if (error) {
      return reply.code(StatusCodes.BAD_REQUEST).send(error);
    }

    return reply.code(StatusCodes.OK).send(data);
  } catch (error) {
    logger.error(error, 'getFormQuestionsHandler: error getting page forms');
    return reply.code(400).send({ message: 'Error getting form questions' });
  }
}

export async function handleDeleteLeadgenSubscription(
  request: FastifyRequest<{ Body: DeleteLeadgenSubscriptionBody }>,
  reply: FastifyReply
) {
  try {
    const { companyId, form_id, dolphin_access_token } = request.body;
    // TODO: Verify user permission

    // TODO: Find and delete relevant document from database
    const deletedSubscription = await findAndDeleteSubscription({
      companyId,
      form_id,
    });
    if (!deletedSubscription) {
      return reply
        .code(StatusCodes.BAD_REQUEST)
        .send("Couldn't find subscription");
    }

    // TODO: Delete subscription from facebook api
    const [data, error] = await deleteSubscriptionFromFacebook({
      page_access_token: deletedSubscription.page_access_token,
      page_id: deletedSubscription.page_id,
    });
    console.log({ data, error });
    if (error) {
      return reply
        .code(StatusCodes.BAD_REQUEST)
        .send("Couldn't delete from facebook-api");
    }

    return reply.code(StatusCodes.OK).send('Deleted successfully');
  } catch (error) {
    logger.error(
      error,
      'deleteSubscriptionFromFacebook: error deleting subscription'
    );
    return reply.code(500).send({ message: 'Error deleting subscription' });
  }
}

export async function editLeadgenSubscriptionHandler(
  request: FastifyRequest<{ Body: EditLeadgenSubscriptionBody }>,
  reply: FastifyReply
) {
  try {
    const { form_id, companyId, dolphin_access_token, questions } =
      request.body;
    // TODO verify user permission

    // TODO edit relevant document
    const result = await findAndUpdateSubscriptionQuestions(
      form_id,
      companyId,
      questions
    );
    console.log(result);

    if (!result) {
      return reply
        .code(StatusCodes.BAD_REQUEST)
        .send("Couldn't update subscription");
    }

    return reply.code(StatusCodes.OK).send('Updated successfully');
  } catch (error) {
    logger.error(
      error,
      'editLeadgenSubscriptionHandler: error updating subscription'
    );
    return reply.code(500).send({ message: 'Error updating subscription' });
  }
}

export async function getSubscriptionHandler(
  request: FastifyRequest<{ Querystring: GetSubscriptionQuery }>,
  reply: FastifyReply
) {
  try {
    const { companyId, form_id, dolphin_access_token } = request.query;
    // TODO verify user permissions

    //  search for subscription
    const subscription = await findSubscription(form_id, companyId);
    if (!subscription)
      return reply
        .code(StatusCodes.BAD_REQUEST)
        .send("Couldn't find subscription");

    //  send back to the user
    return reply.code(StatusCodes.OK).send(subscription);
  } catch (error) {
    logger.error(
      error,
      'editLeadgenSubscriptionHandler: error getting subscription'
    );
    return reply.code(500).send({ message: 'Error getting subscription' });
  }
}
