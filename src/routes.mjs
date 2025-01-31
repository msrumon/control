import {
  getAuthorizeHandler,
  getSigninHandler,
  postAuthorizeHandler,
  postSigninHandler,
} from './handlers.mjs';
import {
  getAuthorizeSchema,
  getSigninSchema,
  postAuthorizeSchema,
  postSigninSchema,
} from './schemas.mjs';
import { validatorCompiler } from './utils.mjs';

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export async function statefulRoutes(fastify) {
  // fastify.get('/signup');

  // fastify.post('/signup');

  fastify.get(
    '/signin',
    { schema: getSigninSchema, validatorCompiler },
    getSigninHandler
  );

  fastify.post(
    '/signin',
    {
      schema: postSigninSchema,
      validatorCompiler,
      preHandler: fastify.csrfProtection,
    },
    postSigninHandler
  );

  fastify.get(
    '/authorize',
    { schema: getAuthorizeSchema, validatorCompiler },
    getAuthorizeHandler
  );

  fastify.post(
    '/authorize',
    { schema: postAuthorizeSchema, validatorCompiler },
    postAuthorizeHandler
  );
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
