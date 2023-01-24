import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createLeadgenSubscriptionHandler,
  exchangeAuthCode,
  getLeadSyncForms,
  retrieveUserAdAccounts,
  validateUserOrganizationRole,
} from './linkedin.controller';
import {
  createLeadgenSubscriptionSchema,
  exchangeAuthCodeSchema,
  getLeadSyncFormsSchema,
  retrieveUserAdAccountsSchema,
  validateUserOrganizationRoleSchema,
} from './linkedin.schema';

export function linkedinRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  app.post(
    '/exchangeAuthCode',
    { schema: exchangeAuthCodeSchema },
    exchangeAuthCode
  );

  app.get(
    '/userAdAccounts',
    { schema: retrieveUserAdAccountsSchema },
    retrieveUserAdAccounts
  );

  app.get(
    '/validateUserOrganizationRole',
    { schema: validateUserOrganizationRoleSchema },
    validateUserOrganizationRole
  );

  app.get(
    '/getLeadSyncForms',
    { schema: getLeadSyncFormsSchema },
    getLeadSyncForms
  );

  app.get(
    '/subscribe',
    { schema: createLeadgenSubscriptionSchema },
    createLeadgenSubscriptionHandler
  );

  done();
}
