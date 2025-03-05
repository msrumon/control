import type { hash, needsRehash, verify } from 'argon2';
import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    argon2: {
      hash: typeof hash;
      needsRehash: typeof needsRehash;
      verify: typeof verify;
    };
  }
}

export const argon2Plugin = fastifyPlugin(async (fastify) => {
  const { hash, needsRehash, verify } = await import('argon2');
  fastify.decorate('argon2', { hash, needsRehash, verify });
}) as FastifyPluginAsync;
