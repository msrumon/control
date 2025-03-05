import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/token', async () => {});

  // fastify.get('/userinfo');

  // fastify.post('/introspect');

  // fastify.post('/revoke');

  // fastify.get('/jwks');

  // fastify.get('/.well-known/openid-configuration');
};
