import fastify from 'fastify';
import cors from '@fastify/cors';

import { facebookRoute } from '../modules/facebook/facebook.route';

export async function createServer() {
  const app = fastify();
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.register(facebookRoute, { prefix: '/api/facebook' });

  return app;
}
