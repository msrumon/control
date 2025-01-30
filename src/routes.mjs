import { getAuthorizeHandler } from './handlers.mjs';
import { getAuthorizeSchema } from './schemas.mjs';

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export async function statefulRoutes(fastify) {
  fastify.get(
    '/authorize',
    { schema: getAuthorizeSchema },
    getAuthorizeHandler
  );
  // fastify.post('/authorize');
}

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export async function statelessRoutes(fastify) {
  // fastify.post('/token');
  // fastify.get('/userinfo');
  // fastify.post('/introspect');
  // fastify.post('/revoke');
  // fastify.get('/jwks');
  // fastify.get('/.well-known/openid-configuration');
}
