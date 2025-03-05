import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import type { Knex } from 'knex';

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
  }
}

export const knexPlugin = fastifyPlugin<Knex.Config>(
  async (fastify, options) => {
    const { default: knex } = await import('knex');
    const instance = knex(options);
    fastify.decorate('knex', instance).addHook('onClose', async (_fastify) => {
      if (_fastify.knex === instance) {
        await _fastify.knex.destroy();
      }
    });
  }
) as FastifyPluginAsync<Knex.Config>;
