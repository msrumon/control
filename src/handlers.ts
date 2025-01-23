import type { RouteHandlerMethod } from 'fastify';

export const mainHandler: RouteHandlerMethod = async () => {
  return { status: 200, error: null, data: { message: 'Hello, world!' } };
};
