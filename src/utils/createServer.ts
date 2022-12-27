import fastify from 'fastify';
import { facebookRoute } from '../modules/facebook/facebook.route';

export async function createServer() {
  const app = fastify();

  app.register(facebookRoute, { prefix: '/api/facebook' });

  return app;
}
