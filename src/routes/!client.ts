import type { FastifyInstance } from 'fastify';

export async function routes(fastify: FastifyInstance) {
  fastify.get('/callback', async function (request, reply) {
    return await reply.send(request.query);
  });
}
