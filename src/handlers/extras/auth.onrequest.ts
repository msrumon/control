import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function (
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify();
}
