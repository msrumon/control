import fastifyPlugin from 'fastify-plugin';
import { hash, needsRehash, verify } from 'argon2';
import knex from 'knex';

/**
 * @type {import('fastify').FastifyPluginAsync<import('knex').Config>}
 */
export const knexPlugin = fastifyPlugin(async function (fastify, options) {
  const instance = knex(options);
  fastify
    .decorate('knex', instance)
    .addHook('onClose', async function (_fastify) {
      if (_fastify.knex === instance) {
        await _fastify.knex.destroy();
      }
    });
});

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export const argon2Plugin = fastifyPlugin(async function (fastify) {
  fastify.decorate('argon2', { hash, needsRehash, verify });
});
