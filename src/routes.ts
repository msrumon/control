import type { FastifyPluginAsync } from 'fastify';

import { mainHandler } from './handlers';

export const mainRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', mainHandler);
};
