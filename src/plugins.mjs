import fastifyPlugin from 'fastify-plugin';

/**
 * @type {import('fastify').FastifyPluginAsync<import('knex').Config>}
 */
export const knexPlugin = fastifyPlugin(async function (fastify, options) {
  const { default: knex } = await import('knex');
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
  const { hash, needsRehash, verify } = await import('argon2');
  fastify.decorate('argon2', { hash, needsRehash, verify });
});

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export const authPlugin = fastifyPlugin(async function (fastify) {
  fastify.decorate('auth', {
    /**
     * @param {number | undefined} duration
     */
    async generateAccessToken(duration = 60 * 60) {
      // TODO
      const token = 'blablabla';
      const time = new Date(Date.now() + duration * 1000);
      return { token, time };
    },
    /**
     * @param {object} client
     * @param {object} uri
     * @param {Array<object>} scopes
     * @param {string | undefined} state
     * @param {number | undefined} duration
     */
    async generateCode(client, uri, scopes, state, duration = 5 * 60) {
      const { randomBytes } = await import('node:crypto');
      const code = randomBytes(16).toString('hex');
      const time = new Date(Date.now() + duration * 1000);
      for (const scope of scopes) {
        await fastify.knex('codes').insert({
          code,
          client_id: client.id,
          uri_id: uri.id,
          scope_id: scope.id,
          state: state || null,
          expires_at: time,
        });
      }
      return { code, time };
    },
    async generateIdToken() {
      // TODO
      const token = 'blablabla';
      return { token };
    },
  });
});
