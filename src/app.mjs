import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import fastifySession from '@fastify/session';
import fastifyView from '@fastify/view';

import { ConnectSessionKnexStore } from 'connect-session-knex';
import Fastify from 'fastify';
import handlebars from 'handlebars';

import knexConfig from '../knexfile.js';
import { argon2Plugin, knexPlugin } from './plugins.mjs';
import { statefulRoutes, statelessRoutes } from './routes.mjs';

const fastify = Fastify({ logger: true });

async function run() {
  try {
    await fastify.register(fastifyEnv, {
      schema: {
        type: 'object',
        properties: {
          DATABASE_URL: { type: 'string' },
          COOKIE_SECRET: { type: 'string' },
          SESSION_SECRET: { type: 'string', minLength: 32 },
        },
        required: ['DATABASE_URL', 'COOKIE_SECRET', 'SESSION_SECRET'],
      },
    });
    await fastify.register(argon2Plugin);
    await fastify.register(knexPlugin, knexConfig);
    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    });
    await fastify.register(fastifySession, {
      secret: process.env.SESSION_SECRET,
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
