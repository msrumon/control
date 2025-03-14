import fastifyPlugin from 'fastify-plugin';

import accessTokenAuth from '../logic/access-token.auth';
import codeAuth from '../logic/code.auth';
import idTokenAuth from '../logic/id-token.auth';

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      generateAccessToken: ReturnType<typeof accessTokenAuth>;
      generateCode: ReturnType<typeof codeAuth>;
      generateIdToken: ReturnType<typeof idTokenAuth>;
    };
  }
}

export const authPlugin = fastifyPlugin(async (fastify) => {
  fastify.decorate('auth', {
    generateAccessToken: accessTokenAuth(fastify),
    generateCode: codeAuth(fastify),
    generateIdToken: idTokenAuth(fastify),
  });
});
