import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    scopes: {
      [key: string]: {
        id: string;
        description: string;
        getData: (id: string) => Promise<Record<string, string>>;
      };
    };
  }
}

export const scopesPlugin = fastifyPlugin(async (fastify) => {
  fastify.decorate('scopes', {
    email: {
      get id() {
        return 'email';
      },
      get description() {
        return 'Access to your email';
      },
      async getData(id) {
        return await fastify
          .knex('users')
          .select('email')
          .where('id', id)
          .first();
      },
    },
    profile: {
      get id() {
        return 'profile';
      },
      get description() {
        return 'Access to your profile';
      },
      async getData(id) {
        return await fastify
          .knex('users')
          .select('name', 'email')
          .where('id', id)
          .first();
      },
    },
  });
}) as FastifyPluginAsync;
