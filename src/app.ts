import Fastify from 'fastify';

import { mainRoutes } from './routes';

const fastify = Fastify({ logger: true });

async function run() {
  try {
    await fastify.register(mainRoutes);
    await fastify.ready();
    await fastify.listen({ port: 2875, host: '0.0.0.0' });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

run();
