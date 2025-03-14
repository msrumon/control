import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function getHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { host, protocol } = request;
  return await reply.send({
    issuer: `${protocol}://${host}`,
    authorization_endpoint: `${protocol}://${host}/authorize`,
    token_endpoint: `${protocol}://${host}/token`,
    userinfo_endpoint: `${protocol}://${host}/userinfo`,
    response_types_supported: ['code', 'id_token', 'token'],
    scopes_supported: ['openid', ...Object.keys(this.scopes)],
    grant_types_supported: ['authorization_code', 'implicit'],
    subject_types_supported: ['public'],
  });
}
