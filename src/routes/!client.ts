import type { FastifyPluginAsync } from "fastify";

export const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/callback', async function (request, reply) {
      return await reply.send(request.query);
    });
  };