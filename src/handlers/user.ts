import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function fetchHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { scope, sub } = request.user;
  const user = await this.knex('users')
    .where({ id: sub })
    .select('name', 'email')
    .first();
  const payload = { id: sub, username: user.name };
  if (scope?.includes('email')) {
    Object.assign(payload, { email: user.email });
  }
  return await reply.send(payload);
}
