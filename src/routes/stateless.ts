import type { FastifyInstance } from 'fastify';

import type { PostIntrospectRoute } from '../../interfaces/routes';
import authOnrequest from '../handlers/extras/auth.onrequest';
import { getHandler as getOidConfHandler } from '../handlers/openid-config';
import {
  introspectHandler as introspectTokenHandler,
  fetchHandler as postTokenHandler,
  revokeHandler as revokeTokenHandler,
} from '../handlers/token';
import { fetchHandler as getUserHandler } from '../handlers/user';
import { postSchema as postIntrospectSchema } from '../schemas/introspect';
import { postSchema as postTokenSchema } from '../schemas/token';
import { getSchema as getUserSchema } from '../schemas/user';

export async function routes(fastify: FastifyInstance) {
  fastify.post('/token', { schema: postTokenSchema }, postTokenHandler);
  fastify.get(
    '/userinfo',
    { schema: getUserSchema, onRequest: authOnrequest },
    getUserHandler
  );
  fastify.post<PostIntrospectRoute>(
    '/introspect',
    { schema: postIntrospectSchema, onRequest: authOnrequest },
    introspectTokenHandler
  );
  fastify.post('/revoke', revokeTokenHandler);
  fastify.get('/.well-known/openid-configuration', getOidConfHandler);
}
