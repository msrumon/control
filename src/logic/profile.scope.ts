import type { FastifyInstance } from 'fastify';

import type { User } from '../../interfaces/models';

export default (fastify: FastifyInstance) => ({
  get id() {
    return 'profile' as const;
  },
  get description() {
    return 'Access to your profile' as const;
  },
  async getData(id: string) {
    return await fastify
      .knex<User>('users')
      .select('name', 'email')
      .where({ id })
      .first();
  },
});
