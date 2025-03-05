import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      generateAccessToken(
        payload: object,
        duration?: number
      ): Promise<{
        token: string;
        time: number;
      }>;
      generateCode(
        uri: Record<string, any>,
        scope: string,
        state?: string,
        duration?: number
      ): Promise<{ code: string; time: number }>;
      generateIdToken(
        payload: object,
        duration?: number
      ): Promise<{
        token: string;
      }>;
    };
  }
}

export const authPlugin = fastifyPlugin(async (fastify) => {
  fastify.decorate('auth', {
    async generateAccessToken(payload: object, duration = 60 * 60) {
      const now = Date.now();
      const extra = { iat: now, exp: now + duration * 1000 };
      return {
        token: fastify.jwt.sign(Object.assign(payload, extra)),
        time: extra.exp,
      };
    },

    async generateCode(
      uri: { id: string },
      scope: string,
      state?: string,
      duration: number = 5 * 60
    ) {
      const exCode = await fastify
        .knex('codes')
        .where({ uri_id: uri.id, scope })
        .first();
      if (exCode) {
        const { code, expires_at: expiresAt, updated_at: updatedAt } = exCode;
        let time = expiresAt - updatedAt;
        if (time > 0) {
          return { code, time };
        }
        time = Date.now() + duration * 1000;
        await fastify
          .knex('codes')
          .where('code', code)
          .update('expires_at', new Date(time));
        return { code, time };
      }

      const { randomBytes } = await import('node:crypto');
      const code = randomBytes(16).toString('hex');
      const time = Date.now() + duration * 1000;
      await fastify.knex('codes').insert({
        code,
        uri_id: uri.id,
        scope,
        state: state || null,
        expires_at: new Date(time),
      });
      return { code, time };
    },

    async generateIdToken(payload: object, duration = 24 * 60 * 60) {
      const now = Date.now();
      const extra = { iat: now, exp: now + duration * 1000 };
      return { token: fastify.jwt.sign(Object.assign(payload, extra)) };
    },
  });
}) as FastifyPluginAsync;
