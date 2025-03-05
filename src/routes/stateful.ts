import type { FastifyPluginAsync } from 'fastify';

import {
  getHandler as getAuthorizeHandler,
  postHandler as postAuthorizeHandler,
  preHandler as preAuthHandler,
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

export const routes: FastifyPluginAsync = async (fastify) => {
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
    { schema: getAuthorizeSchema, preHandler: preAuthHandler },
    getAuthorizeHandler
  );

  fastify.post(
    '/authorize',
    { schema: postAuthorizeSchema, preHandler: preAuthHandler },
    postAuthorizeHandler
  );
};
