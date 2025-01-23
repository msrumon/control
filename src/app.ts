import fastifyView from '@fastify/view';

import Fastify from 'fastify';
import handlebars from 'handlebars';

import { statefulRoutes, statelessRoutes } from './routes';

const fastify = Fastify({ logger: true });

async function run() {
  try {
    await fastify.register(fastifyView, {
      engine: { handlebars },
      defaultContext: { app: 'Control' },
      root: 'views',
      layout: '_layout.hbs',
    });

    // TODO: Delete later.
    await fastify.register(async (_fastify) => {
      _fastify.get('/authenticate', async (_request, _reply) => {
        return await _reply.viewAsync('authenticate');
      });
      _fastify.get('/consent', async (_request, _reply) => {
        return await _reply.viewAsync('consent', {
          client: 'Test Client',
          scopes: [
            { name: 'email', description: 'Access to your email' },
            { name: 'profile', description: 'Access to your profile' },
          ],
        });
      });
    });

    await fastify.register(statefulRoutes);
    await fastify.register(statelessRoutes);
    await fastify.ready();
    await fastify.listen({ port: 2875, host: '0.0.0.0' });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

run();
