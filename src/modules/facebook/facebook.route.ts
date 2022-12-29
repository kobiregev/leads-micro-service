import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getNewLeadDataHandler,
  getPageFormsHandler,
  getUserPagesHandler,
  webhookChallengeHandler,
} from './facebook.controller';
import { getPageFormsSchema, getUserPagesSchema } from './facebook.schema';

export function facebookRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  app.get('/webhook', webhookChallengeHandler);
  app.get('/pages', { schema: getUserPagesSchema }, getUserPagesHandler);
  app.get('/forms', { schema: getPageFormsSchema }, getPageFormsHandler);
  app.post('/webhook', getNewLeadDataHandler);
  done();
}
