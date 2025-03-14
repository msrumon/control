import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { Code, Uri } from '../../interfaces/models';
import type { PostIntrospectRoute, PostTokenRoute } from '../../interfaces/routes';

export async function fetchHandler(
  this: FastifyInstance,
  request: FastifyRequest<PostTokenRoute>,
  reply: FastifyReply
) {
  const {
    code: authCode,
    client_id: clientId,
    redirect_uri: redirectUri,
    state, // TODO: Use.
  } = request.body;
  const uri = await this.knex<Uri>('uris')
    .where({ link: redirectUri, client_id: clientId })
    .first();
  if (!uri) {
    return await reply.badRequest('Invalid URI.');
  }
  const code = await this.knex<Code>('codes')
    .where({ code: authCode, uri_id: uri.id })
    .first();
  if (!code) {
    return await reply.badRequest('Invalid code.');
  }
  if (Number(code.expires_at) < Date.now()) {
    await this.knex<Code>('codes').where({ id: code.id }).delete();
    return await reply.badRequest('Invalid code.');
  }
  const scopes = this.scope2scopes(code.scopes);
  const payload = {
    aud: code.uri_id,
    sub: code.user_id,
    scope: code.scopes,
  };
  for (const scope of scopes) {
    Object.assign(payload, await scope.getData(code.user_id));
  }
  const { token, time } = await this.auth.generateAccessToken(payload);
  await this.knex<Code>('codes').where({ id: code.id }).delete();
  return await reply.send({
    access_token: token,
    token_type: 'Bearer',
    expires_in: Math.round((time - Date.now()) / 1000).toString(),
  });
}

export async function introspectHandler(
  this: FastifyInstance,
  request: FastifyRequest<PostIntrospectRoute>,
  reply: FastifyReply
) {
  const { token } = request.body;
  try {
    const data = await new Promise<object>((resolve, reject) => {
      this.jwt.verify(token, (err, payload) => {
        if (err) reject(err);
        else resolve(payload);
      });
    });
    return await reply.send({ active: true, ...data });
  } catch (error) {
    return await reply.send({ active: false });
  }
}

export async function revokeHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {}
