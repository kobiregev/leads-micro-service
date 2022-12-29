import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createLeadgenSubscriptionHandler,
  getNewLeadDataHandler,
  getPageFormsHandler,
  getUserPagesHandler,
  webhookChallengeHandler,
} from './facebook.controller';
import {
  createLeadgenSubscriptionSchema,
  getPageFormsSchema,
  getUserPagesSchema,
} from './facebook.schema';

export function facebookRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  app.get('/webhook', webhookChallengeHandler);
  app.post('/webhook', getNewLeadDataHandler);
  app.get('/pages', { schema: getUserPagesSchema }, getUserPagesHandler);
  app.get('/forms', { schema: getPageFormsSchema }, getPageFormsHandler);
  app.get(
    '/subscribe',
    { schema: createLeadgenSubscriptionSchema },
    createLeadgenSubscriptionHandler
  );
  done();
}
