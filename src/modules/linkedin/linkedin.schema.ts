import { Static, Type } from '@sinclair/typebox';

export const exchangeAuthCodeSchema = {
  tags: ['linkedin'],
  description: 'Exchange linkedin access code for access token',
  body: Type.Object({
    access_code: Type.String(),
  }),
  response: {
    200: {
      access_token: Type.String(),
    },
  },
};
export type exchangeAuthCodeBody = Static<typeof exchangeAuthCodeSchema.body>;

// export const UserAdAccounts = Type.Object({
//   data: Type.Object({
//     paging: Type.Object({
//       total: Type.Number(),
//       start: Type.Number(),
//       count: Type.Number(),
//       links: Type.Any(),
//     }),
//   }),
// });

export const retrieveUserAdAccountsSchema = {
  tags: ['linkedin'],
  description: 'Get user add accounts',
  query: Type.Object({
    access_token: Type.String(),
  }),
  // response: {
  //   200: Type.Any(),
  // },
};

export type retrieveUserAdAccountsQuery = Static<
  typeof retrieveUserAdAccountsSchema.query
>;

export const validateUserOrganizationRoleSchema = {
  tags: ['linkedin'],
  description: 'validate user organization role',
  query: Type.Object({
    access_token: Type.String(),
    account_id: Type.String(),
  }),
};
export type ValidateUserOrganizationRoleQuery = Static<
  typeof validateUserOrganizationRoleSchema.query
>;

export const getLeadSyncFormsSchema = {
  tags: ['linkedin'],
  description: 'getting lead forms',
  query: Type.Object({
    access_token: Type.String(),
    adAccount: Type.String(),
  }),
};

export type getLeadSyncFormsQuery = Static<typeof getLeadSyncFormsSchema.query>;

export const createLeadgenSubscriptionSchema = {
  tags: ['linkedin'],
  description: 'getting lead forms',
  query: Type.Object({
    access_token: Type.String(),
    sponsoredEntity: Type.String(), //adAcounturn
    formId: Type.String(),
  }),
};

export type CreateLeadgenSubscriptionQuery = Static<
  typeof createLeadgenSubscriptionSchema.query
>;
/*
export interface LinkedinLeadSyncForm {
    createdTime:       number;
    accountUrn:        string;
    campaignUrn:       string;
    creativeUrn:       string;
    formUrn:           string;
    adFormResponseUrn: string;
}
*/
