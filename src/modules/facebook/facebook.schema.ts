import { Static, Type } from '@sinclair/typebox';

const pages = Type.Array(
  Type.Object({
    name: Type.String(),
    id: Type.String(),
    access_token: Type.String(),
  })
);

const forms = Type.Array(
  Type.Object({
    name: Type.String(),
    id: Type.String(),
    status: Type.String(),
  })
);

const facebook = Type.Object({
  _id: Type.String(),
  pageId: Type.String(),
  formId: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const getUserPagesSchema = {
  tags: ['facebook'],
  description: 'Gets user pages',
  query: Type.Object({
    access_token: Type.String(),
    user_id: Type.String(),
  }),
  response: {
    200: pages,
  },
};

export type GetUserPagesQueryType = Static<typeof getUserPagesSchema.query>;

// get forms

export const getPageFormsSchema = {
  tags: ['facebook'],
  description: 'Gets page forms',
  query: Type.Object({
    access_token: Type.String(),
    page_id: Type.String(),
  }),
  response: {
    200: forms,
  },
};

export type GetPageFormsQueryType = Static<typeof getPageFormsSchema.query>;

export const RefreshPageLongLivedAccessTokenSchema = {
  tags: ['facebook'],
  description: 'Refresh the subscription page access token',
  body: Type.Object({
    access_token: Type.String(),
    user_id: Type.String(),
    page_id: Type.String(),
  }),
};

// 1. require user_token,page_token and create a long lived page token and save it
export const createLeadgenSubscriptionSchema = {
  tags: ['facebook'],
  description: 'Create page to app subscription,and create facebook model',
  query: Type.Object({
    page_access_token: Type.String(),
    user_access_token: Type.String(),
    user_id: Type.String(),
    page_id: Type.String(),
    page_name: Type.String(),
    form_id: Type.String(),
    form_name: Type.String(),
  }),
  body: Type.Object({
    questions: Type.Array(
      Type.Object({
        key: Type.Optional(Type.String()),
        predefinedField: Type.String(),
      })
    ),
    dolphin_access_token: Type.String(),
    campaignId: Type.String(),
    companyId: Type.String(),
  }),
  // TODO: change to a proper response
  response: {
    201: facebook,
  },
};

export type CreateLeadgenSubscriptionQuery = Static<
  typeof createLeadgenSubscriptionSchema.query
>;
export type CreateLeadgenSubscriptionBody = Static<
  typeof createLeadgenSubscriptionSchema.body
>;
export type RefreshPageLongLivedAccessTokenBody = Static<
  typeof RefreshPageLongLivedAccessTokenSchema.body
>;
export const getNewLeadDataSchema = {
  tags: ['facebook'],
  description: 'Receive new leadgen via facebook webhook',
  body: Type.Object({
    entry: Type.Array(
      Type.Object({
        id: Type.String(),
        time: Type.String(),
        changes: Type.Array(
          Type.Object({
            value: Type.Object({
              created_time: Type.Number(),
              leadgen_id: Type.String(),
              page_id: Type.String(),
              form_id: Type.String(),
            }),
            field: Type.String(),
          })
        ),
      })
    ),
    object: Type.String(),
  }),
  //TODO: change to a proper response
};

export type GetNewLeadDataBody = Static<typeof getNewLeadDataSchema.body>;

export const getFormQuestionsSchema = {
  tags: ['facebook'],
  description: 'Get form questions',
  query: Type.Object({
    form_id: Type.String(),
    page_access_token: Type.String(),
  }),
};
export type GetFormQuestionsQuery = Static<typeof getFormQuestionsSchema.query>;

export const webhookChallengeSchema = {
  tags: ['facebook'],
  description: 'facebook security challenge',
  query: Type.Object({
    'hub.verify_token': Type.String(),
    'hub.challenge': Type.String(),
  }),
};
export type WebhookChallengeQuery = Static<typeof webhookChallengeSchema.query>;

export const deleteLeadgenSubscriptionSchema = {
  tags: ['facebook'],
  description: 'Delete facebook leadgen subscription',
  body: Type.Object({
    form_id: Type.String(),
    companyId: Type.String(),
    dolphin_access_token: Type.String(),
  }),
};
export type DeleteLeadgenSubscriptionBody = Static<
  typeof deleteLeadgenSubscriptionSchema.body
>;

export const editLeadgenSubscriptionSchema = {
  tags: ['facebook'],
  description: 'Edit facebook leadgen subscription',
  body: Type.Object({
    form_id: Type.String(),
    companyId: Type.String(),
    dolphin_access_token: Type.String(),
    questions: Type.Array(
      Type.Object({
        key: Type.Optional(Type.String()),
        predefinedField: Type.String(),
      })
    ),
  }),
};

export type EditLeadgenSubscriptionBody = Static<
  typeof editLeadgenSubscriptionSchema.body
>;
export const getSubscriptionSchema = {
  tags: ['facebook'],
  description: 'get facebook leadgen subscription',
  query: Type.Object({
    form_id: Type.String(),
    companyId: Type.String(),
    dolphin_access_token: Type.String(),
  }),
};
export type GetSubscriptionQuery = Static<typeof getSubscriptionSchema.query>;

export const getSubscriptionsSchema = {
  tags: ['facebook'],
  description: 'get facebook leadgen subscriptions',
  query: Type.Object({
    companyId: Type.String(),
    dolphin_access_token: Type.Optional(Type.String()),
  }),
};
export type GetSubscriptionsQuery = Static<typeof getSubscriptionsSchema.query>;
