import { logger } from '@typegoose/typegoose/lib/logSettings';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { StatusCodes } from 'http-status-codes';
import {
  CreateLeadgenSubscriptionQuery,
  exchangeAuthCodeBody,
  getLeadSyncFormsQuery,
  retrieveUserAdAccountsQuery,
  ValidateUserOrganizationRoleQuery,
} from './linkedin.schema';
import {
  createLeadNotificationURL,
  getAdAccountOrganization,
  getAuthToken,
  getOrganizationAcls,
  getOrganizationElement,
  getUserAdAccounts,
  retrieveLeadSyncForms,
} from './linkedin.service';

export async function exchangeAuthCode(
  request: FastifyRequest<{ Body: exchangeAuthCodeBody }>,
  reply: FastifyReply
) {
  try {
    const [data, error] = await getAuthToken(request.body.access_code);

    if (error) {
      return reply.status(StatusCodes.BAD_REQUEST).send(error);
    }

    return reply.status(StatusCodes.OK).send(data);
  } catch (error) {
    logger.error(error, 'exchangeAuthCode: error exchanging access_token');
    return reply.code(500).send({ message: 'Error exchanging access_token' });
  }
}

export async function retrieveUserAdAccounts(
  request: FastifyRequest<{ Querystring: retrieveUserAdAccountsQuery }>,
  reply: FastifyReply
) {
  try {
    const [data, error] = await getUserAdAccounts(request.query.access_token);
    if (error) {
      return reply.status(StatusCodes.BAD_REQUEST).send(error);
    }

    return reply.status(StatusCodes.OK).send(data);
  } catch (error) {
    logger.error(error, 'getUserAdAccounts: error getting user ad accounts');
    return reply.code(500).send({ message: 'Error getting user ad accounts' });
  }
}

const LINKEDIN_AUTH_ROLES = ['LEAD_GEN_FORM_MANAGER', 'ADMINISTRATOR'];

export async function validateUserOrganizationRole(
  request: FastifyRequest<{ Querystring: ValidateUserOrganizationRoleQuery }>,
  reply: FastifyReply
) {
  try {
    const { access_token, account_id } = request.query;
    const [data, error] = await getAdAccountOrganization(
      access_token,
      account_id
    );
    const [data2, error2] = await getOrganizationAcls(access_token);

    if (error || error2) {
      return reply.status(400).send({ isAuthorized: false });
    }

    const isAuthorized = data2.elements.find((el: getOrganizationElement) => {
      return (
        el.organization === data.reference &&
        LINKEDIN_AUTH_ROLES.includes(el.role)
      );
    });

    return reply.status(StatusCodes.OK).send({ isAuthorized: !!isAuthorized });
  } catch (error) {
    logger.error(
      error,
      'validateUserOrganizationRole: error validating user organization role'
    );
    return reply
      .code(500)
      .send({ message: 'Error validating user organization role' });
  }
}

export async function getLeadSyncForms(
  request: FastifyRequest<{ Querystring: getLeadSyncFormsQuery }>,
  reply: FastifyReply
) {
  try {
    const [data, error] = await retrieveLeadSyncForms(request.query);

    if (error) {
      return reply.status(StatusCodes.BAD_REQUEST).send(error);
    }

    return reply.status(StatusCodes.OK).send(data);
  } catch (error) {
    logger.error(error, 'getLeadSyncForms: error getting lead sync forms');
    return reply.code(500).send({ message: 'Error getting lead sync forms' });
  }
}

export async function createLeadgenSubscriptionHandler(
  request: FastifyRequest<{ Querystring: CreateLeadgenSubscriptionQuery }>,
  reply: FastifyReply
) {
  try {
    const [data, error] = await createLeadNotificationURL(request.query);

    if (error) {
      return reply.status(StatusCodes.BAD_REQUEST).send(error);
    }

    reply.status(StatusCodes.OK).send(data);
  } catch (error) {
    logger.error(
      error,
      'createLeadgenSubscriptionHandler: error creating subscription'
    );
    return reply.code(500).send({ message: 'Error creating subscription' });
  }
}
