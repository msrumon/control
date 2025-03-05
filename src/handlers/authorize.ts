import type { preHandlerAsyncHookHandler, RouteHandlerMethod } from 'fastify';

import { configureRedirectUrl } from '../utilities/redirect-url';

export const preHandler: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const { user: exUser } = request.session;
  if (!exUser) {
    return await reply.redirect(
      `/signin?next=${encodeURIComponent(request.url)}`
    );
  }

  const { client_id: clientId, redirect_uri: redirectUri } =
    request.query as Record<string, string>;

  const client = await request.server
    .knex('clients')
    .where('id', clientId)
    .first();
  if (!client) {
    return await reply.notFound('Client not found.');
  }

  const uri = await request.server
    .knex('uris')
    .where('client_id', client.id)
    .first();
  if (uri.link !== decodeURIComponent(redirectUri)) {
    return await reply.badRequest('URI mismatched.');
  }

  request.client = client;
  request.uri = uri;
};

export const getHandler: RouteHandlerMethod = async (request, reply) => {
  const { scope } = request.query as Record<string, string>;
  if (scope === 'openid') {
    return await reply.redirect(await configureRedirectUrl(request));
  }

  return await reply.viewAsync('consent', {
    _csrf: reply.generateCsrf(),
    client: request.client,
    scopes: scope.split(' ').map((scope) => request.server.scopes[scope]),
  });
};

export const postHandler: RouteHandlerMethod = async (request, reply) => {
  const { consent } = request.body as Record<string, 'no' | 'yes'>;
  return await reply.redirect(await configureRedirectUrl(request, consent));
};
