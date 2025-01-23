import type { FastifyPluginAsync } from 'fastify';

import { getAuthorizeHandler } from './handlers';
import { getAuthorizeSchema } from './schemas';

export const statefulRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/authorize',
    { schema: getAuthorizeSchema },
    getAuthorizeHandler
  );
  // fastify.post('/authorize');
};

export const statelessRoutes: FastifyPluginAsync = async (fastify) => {
  // fastify.post('/token');
  // fastify.get('/userinfo');
  // fastify.post('/introspect');
  // fastify.post('/revoke');
  // fastify.get('/jwks');
  // fastify.get('/.well-known/openid-configuration');
};
