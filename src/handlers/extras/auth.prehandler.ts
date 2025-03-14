import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { Client, Uri } from '../../../interfaces/models';

export default async function (
  this: FastifyInstance,
  request: FastifyRequest<{ Querystring: Record<string, string> }>,
  reply: FastifyReply
) {
  const { user: exUser } = request.session;
  if (!exUser) {
    return await reply.redirect(
      `/signin?next=${encodeURIComponent(request.url)}`
    );
  }

  const { client_id: clientId, redirect_uri: redirectUri } = request.query;

  const client = await this.knex<Client>('clients')
    .where('id', clientId)
    .first();
  if (!client) {
    return await reply.notFound('Client not found.');
  }

  const uri = await this.knex<Uri>('uris')
    .where('client_id', client.id)
    .first();
  if (uri!.link !== decodeURIComponent(redirectUri)) {
    return await reply.badRequest('URI mismatched.');
  }

  request.client = client;
  request.uri = uri;
}
