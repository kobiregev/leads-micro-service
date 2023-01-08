import { LogLevels } from '@typegoose/typegoose';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { logger } from '../../utils/logger';
import { FieldData } from './facebook.model';
import {
  CreateLeadgenSubscriptionQuery,
  GetNewLeadDataBody,
  GetPageFormsQueryType,
  GetUserPagesQueryType,
} from './facebook.schema';
import {
  createFacebookLead,
  createFacebookSubscription,
  findFacebookLeadgenInfo,
  getFullLeadData,
  getLongLivedPageAccessToken,
  getPageForms,
  getUserPages,
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
    const facebookLead = await createFacebookLead({
      data: field_data,
      lead_id: id,
      ...rest,
      form_id,
    });
  } catch (error) {
    logger.error(error, 'getNewLeadDataHandler: error getting new lead');
    return reply.code(400).send({ message: 'Error getting new lead' });
  }
}

// get form id and page id
// subscribe page to app
// create facebook(formId,pageId)
export async function createLeadgenSubscriptionHandler(
  request: FastifyRequest<{ Querystring: CreateLeadgenSubscriptionQuery }>,
  reply: FastifyReply
) {
  try {
    //subscribing page to app
    const data = await subscribePageToApp(request.query);
    // get Long lived page token
    if (!data.success) throw new Error('Failed to Subscribe to page');

    const longLivedPageToken = await getLongLivedPageAccessToken(request.query);

    const facebook = await createFacebookSubscription({
      ...request.query,
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
      .send({ message: 'Error creating leadgen subscription' });
  }
}

interface IChallengeQueryString {
  'hub.verify_token': string;
  'hub.challenge': string;
}

export function webhookChallengeHandler(
  request: FastifyRequest<{ Querystring: IChallengeQueryString }>,
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
