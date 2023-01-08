import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import { facebookRoute } from '../modules/facebook/facebook.route';
import { version } from '../../package.json';
export async function createServer() {
  const app = fastify();

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  // app.register(swagger, {
  //   prefix: '/docs',
  //   swagger: {
  //     tags: [{ name: 'facebook' }],
  //     info: {
  //       title: 'Facebook',
  //       description: 'Create subscription to facebook',
  //       version,
  //     },
  //   },
  //   staticCSP: true,
  //   exposeRoute: true,
  // });

  app.register(facebookRoute, { prefix: '/api/facebook' });

  return app;
}
