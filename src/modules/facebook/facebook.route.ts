import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createLeadgenSubscriptionHandler,
  editLeadgenSubscriptionHandler,
  getFormQuestionsHandler,
  getNewLeadDataHandler,
  getPageFormsHandler,
  getSubscriptionHandler,
  getSubscriptionsHandler,
  getUserPagesHandler,
  handleDeleteLeadgenSubscription,
  webhookChallengeHandler,
} from './facebook.controller';
import {
  createLeadgenSubscriptionSchema,
  deleteLeadgenSubscriptionSchema,
  editLeadgenSubscriptionSchema,
  getFormQuestionsSchema,
  getNewLeadDataSchema,
  getPageFormsSchema,
  getSubscriptionSchema,
  getSubscriptionsSchema,
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

  app.put(
    '/subscription',
    { schema: editLeadgenSubscriptionSchema },
    editLeadgenSubscriptionHandler
  );

  app.get(
    '/subscription',
    { schema: getSubscriptionSchema },
    getSubscriptionHandler
  );

  app.get(
    '/subscriptions',
    { schema: getSubscriptionsSchema },
    getSubscriptionsHandler
  );

  done();
}
