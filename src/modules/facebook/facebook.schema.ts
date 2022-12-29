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

//createLeadgenSubscription
export const createLeadgenSubscriptionSchema = {
  tags: ['facebook'],
  description: 'Create page to app subscription,and create faceboook model',
  query: Type.Object({
    access_token: Type.String(),
    page_id: Type.String(),
    form_id: Type.String(),
  }),
  //todo: change to a proper response
  response: {
    201: facebook,
  },
};
export type CreateLeadgenSubscriptionQuery = Static<
  typeof createLeadgenSubscriptionSchema.query
>;
