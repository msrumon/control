import type { FastifyInstance } from 'fastify';

export default (fastify: FastifyInstance) =>
  async (payload: object, duration = 24 * 60 * 60) => {
    const now = Date.now();
    const extra = { iat: now, exp: now + duration * 1000 };
    return { token: fastify.jwt.sign(Object.assign(payload, extra)) };
  };
