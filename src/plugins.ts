import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import knex, { Knex } from 'knex';

declare module 'fastify' {
  export interface FastifyInstance {
    knex: Knex;
  }
}

export const knexPlugin: FastifyPluginAsync<Knex.Config> = fastifyPlugin(
  async (fastify, options) => {
    const instance = knex(options);
    fastify.decorate('knex', instance).addHook('onClose', async (_fastify) => {
      if (_fastify.knex === instance) {
        await _fastify.knex.destroy();
      }
    });
  },
);
