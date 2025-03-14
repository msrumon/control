import type { FastifyInstance } from 'fastify';

import type { Code, Uri, User } from '../../interfaces/models';

export default (fastify: FastifyInstance) =>
  async (
    uri: Uri,
    user: User,
    scopes: string,
    state?: string,
    duration: number = 5 * 60
  ) => {
    const exCode = await fastify
      .knex<Code>('codes')
      .where({ uri_id: uri.id, scopes } as Partial<Code>)
      .first();
    if (exCode) {
      const { code, expires_at: expiresAt, updated_at: updatedAt } = exCode;
      let time = Number(expiresAt) - Number(updatedAt);
      if (time > 0) {
        return { code, time };
      }
      time = Date.now() + duration * 1000;
      await fastify
        .knex<Code>('codes')
        .where({ code })
        .update('expires_at', new Date(time));
      return { code, time };
    }

    const { randomBytes } = await import('node:crypto');
    const code = randomBytes(16).toString('hex');
    const time = Date.now() + duration * 1000;
    await fastify.knex('codes').insert({
      code,
      uri_id: uri.id,
      user_id: user.id,
      scopes,
      state: state || null,
      expires_at: new Date(time),
    });
    return { code, time };
  };
