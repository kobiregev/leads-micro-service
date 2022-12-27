import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getNewLeadDataHandler,
  webhookChallengeHandler,
} from './facebook.controller';

export function facebookRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  app.get('/webhook', webhookChallengeHandler);
  app.post('/webhook', getNewLeadDataHandler);
  done();
}
