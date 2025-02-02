import {
  getAuthorizeHandler,
  getSigninHandler,
  handleAuth,
  postAuthorizeHandler,
  postSigninHandler,
} from './handlers.mjs';
import {
  getAuthorizeSchema,
  getSigninSchema,
  postAuthorizeSchema,
  postSigninSchema,
} from './schemas.mjs';

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export async function statefulRoutes(fastify) {
  // fastify.get('/signup');

  // fastify.post('/signup');

  fastify.get('/signin', { schema: getSigninSchema }, getSigninHandler);

  fastify.post(
    '/signin',
    { schema: postSigninSchema, preHandler: fastify.csrfProtection },
    postSigninHandler
  );

  fastify.get(
    '/authorize',
    { schema: getAuthorizeSchema, preHandler: handleAuth },
    getAuthorizeHandler
  );

  fastify.post(
    '/authorize',
    { schema: postAuthorizeSchema, preHandler: handleAuth },
    postAuthorizeHandler
  );
}

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export async function statelessRoutes(fastify) {
  fastify.post('/token', async function () {});

  // fastify.get('/userinfo');

  // fastify.post('/introspect');

  // fastify.post('/revoke');

  // fastify.get('/jwks');

  // fastify.get('/.well-known/openid-configuration');
}

/**
 * ! Sample Route(s) for Clients
 *
 * @type {import('fastify').FastifyPluginAsync}
 */
export async function clientRoutes(fastify) {
  fastify.get('/callback', async function (request, reply) {
    return await reply.send(request.query);
  });
}
