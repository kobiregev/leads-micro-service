import { Static, Type } from '@sinclair/typebox';

const pages = Type.Array(
  Type.Object({
    name: Type.String(),
    id: Type.String(),
    access_token: Type.String(),
  })
);

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
const forms = Type.Array(
  Type.Object({
    name: Type.String(),
    id: Type.String(),
    status: Type.String(),
  })
);

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
