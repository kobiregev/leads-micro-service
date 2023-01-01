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

// 1. require user_token,page_token and create a long lived page token and save it
export const createLeadgenSubscriptionSchema = {
  tags: ['facebook'],
  description: 'Create page to app subscription,and create faceboook model',
  query: Type.Object({
    page_access_token: Type.String(),
    user_access_token: Type.String(),
    user_id: Type.String(),
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

export const getNewLeadDataSchema = {
  tags: ['facebook'],
  description: 'Recive new leadgen via facebook webhook',
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
  //todo: change to a proper response
};

export type GetNewLeadDataBody = Static<typeof getNewLeadDataSchema.body>;
