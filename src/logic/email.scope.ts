import type { FastifyInstance } from 'fastify';

import type { User } from '../../interfaces/models';

export default (fastify: FastifyInstance) => ({
  get id() {
    return 'email' as const;
  },
  get description() {
    return 'Access to your email' as const;
  },
  async getData(id: string) {
    return await fastify
      .knex<User>('users')
      .select('email')
      .where({ id })
      .first();
  },
});
