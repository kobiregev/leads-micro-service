import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { logger } from '../../utils/logger';
import {
  GetPageFormsQueryType,
  GetUserPagesQueryType,
} from './facebook.schema';
import { getPageForms, getUserPages } from './facebook.service';

// Not Implemnted
export function getNewLeadDataHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    logger.info(request.body);
  } catch (error) {
    logger.error(error, 'getNewLeadDataHandler: error getting new lead');
    return reply.code(400).send({ message: 'Error getting new lead' });
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
