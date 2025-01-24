import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import fastifySession from '@fastify/session';
import fastifyView from '@fastify/view';

import { ConnectSessionKnexStore } from 'connect-session-knex';
import Fastify from 'fastify';
import handlebars from 'handlebars';

import { knexPlugin } from './plugins';
import { statefulRoutes, statelessRoutes } from './routes';

const fastify = Fastify({ logger: true });

async function run() {
  try {
    await fastify.register(fastifyEnv, {
      schema: {
        type: 'object',
        properties: {
          COOKIE_SECRET: { type: 'string' },
          SESSION_SECRET: { type: 'string', minLength: 32 },
          DATABASE_URL: { type: 'string' },
        },
        required: ['COOKIE_SECRET', 'SESSION_SECRET', 'DATABASE_URL'],
      },
    });
    await fastify.register(knexPlugin, {
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });
    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET!,
    });
    await fastify.register(fastifySession, {
      secret: process.env.SESSION_SECRET!,
      store: new ConnectSessionKnexStore({ knex: fastify.knex }),
    });
    await fastify.register(fastifyCors);
    await fastify.register(fastifyView, {
      engine: { handlebars },
      defaultContext: { app: 'Control' },
      root: 'views',
      layout: '_layout.hbs',
    });

    // TODO: Delete later.
    await fastify.register(async (_fastify) => {
      _fastify.get('/authenticate', async (_request, _reply) => {
        return await _reply.viewAsync('signin');
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
