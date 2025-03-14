import type { FastifyInstance, RouteHandlerMethod } from 'fastify';

import authPrehandler from '../handlers/extras/auth.prehandler';
import {
  getHandler as getAuthorizeHandler,
  postHandler as postAuthorizeHandler,
} from '../handlers/authorize';
import {
  getHandler as getSigninHandler,
  postHandler as postSigninHandler,
} from '../handlers/signin';
import {
  getSchema as getAuthorizeSchema,
  postSchema as postAuthorizeSchema,
} from '../schemas/authorize';
import {
  getSchema as getSigninSchema,
  postSchema as postSigninSchema,
} from '../schemas/signin';

export async function routes(fastify: FastifyInstance) {
  // fastify.get('/signup');
  // fastify.post('/signup');
  fastify.get(
    '/signin',
    { schema: getSigninSchema },
    getSigninHandler
  );
  fastify.post(
    '/signin',
    { schema: postSigninSchema, preHandler: fastify.csrfProtection },
    postSigninHandler as RouteHandlerMethod
  );
  fastify.get(
    '/authorize',
    { schema: getAuthorizeSchema, preHandler: authPrehandler },
    getAuthorizeHandler
  );
  fastify.post(
    '/authorize',
    { schema: postAuthorizeSchema, preHandler: authPrehandler },
    postAuthorizeHandler
  );
}
