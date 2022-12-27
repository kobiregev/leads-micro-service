import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { logger } from '../../utils/logger';

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
