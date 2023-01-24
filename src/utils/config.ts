import envSchema from 'env-schema';
import { Type, Static } from '@sinclair/typebox';

const schema = Type.Object({
  PORT: Type.Number({
    default: 4000,
  }),
  HOST: Type.String({
    default: '0.0.0.0',
  }),
  FACEBOOK_APP_TOKEN: Type.String(),
  DATABASE_URL: Type.String(),
  APP_SECRET: Type.String(),
  APP_ID: Type.String(),
  LINKEDIN_CLIENT_SECRET: Type.String(),
  LINKEDIN_CLIENT_ID: Type.String(),
  LINKEDIN_REDIRECT_URI: Type.String(),
});

type Env = Static<typeof schema>;

export const config = envSchema<Env>({ schema, dotenv: true });
