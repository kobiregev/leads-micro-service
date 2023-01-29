import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createLeadgenSubscriptionHandler,
  getFormQuestionsHandler,
  getNewLeadDataHandler,
  getPageFormsHandler,
  getUserPagesHandler,
  handleDeleteLeadgenSubscription,
  webhookChallengeHandler,
} from './facebook.controller';
import {
  createLeadgenSubscriptionSchema,
  deleteLeadgenSubscriptionSchema,
  getFormQuestionsSchema,
  getNewLeadDataSchema,
  getPageFormsSchema,
  getUserPagesSchema,
} from './facebook.schema';

export function facebookRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  app.get('/webhook', webhookChallengeHandler);
  app.post('/webhook', { schema: getNewLeadDataSchema }, getNewLeadDataHandler);
  app.get('/pages', { schema: getUserPagesSchema }, getUserPagesHandler);
  app.get('/forms', { schema: getPageFormsSchema }, getPageFormsHandler);

  app.post(
    '/subscribe',
    { schema: createLeadgenSubscriptionSchema },
    createLeadgenSubscriptionHandler
  );

  app.get(
    '/questions',
    { schema: getFormQuestionsSchema },
    getFormQuestionsHandler
  );

  app.delete(
    '/subscription',
    { schema: deleteLeadgenSubscriptionSchema },
    handleDeleteLeadgenSubscription
  );
  done();
}
