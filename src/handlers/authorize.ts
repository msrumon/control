import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type {
  GetAuthorizeRoute,
  PostAuthorizeRoute,
} from '../../interfaces/routes';
import { configureRedirectUrl } from '../helpers/redirect-url';

export async function getHandler(
  this: FastifyInstance,
  request: FastifyRequest<GetAuthorizeRoute>,
  reply: FastifyReply
) {
  const { scope } = request.query;
  if (scope === 'openid') {
    const url = await configureRedirectUrl(request);
    return await reply.redirect(url.href);
  }

  return await reply.viewAsync('consent', {
    _csrf: reply.generateCsrf(),
    client: request.client,
    scopes: this.scope2scopes(scope),
  });
}

export async function postHandler(
  this: FastifyInstance,
  request: FastifyRequest<PostAuthorizeRoute>,
  reply: FastifyReply
) {
  const { consent } = request.body;
  const url = await configureRedirectUrl(request, consent);
  return await reply.redirect(url.href);
}
