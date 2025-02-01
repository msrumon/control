import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyEnv from '@fastify/env';
import fastifyFlash from '@fastify/flash';
import fastifyFormbody from '@fastify/formbody';
import fastifySensible from '@fastify/sensible';
import fastifySession from '@fastify/session';
import fastifyView from '@fastify/view';

import { ConnectSessionKnexStore } from 'connect-session-knex';
import Fastify from 'fastify';
import handlebars from 'handlebars';
import htmlMinifier from 'html-minifier-terser';

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
    await fastify.register(fastifySensible);
    await fastify.register(fastifyFormbody);
    await fastify.register(knexPlugin, knexConfig);
    await fastify.register(argon2Plugin);
    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    });
    await fastify.register(fastifySession, {
      secret: process.env.SESSION_SECRET,
      cookie: { httpOnly: true, secure: 'auto' },
      store: new ConnectSessionKnexStore({ knex: fastify.knex }),
    });
    await fastify.register(fastifyCsrfProtection);
    await fastify.register(fastifyFlash);
    await fastify.register(fastifyCors);
    await fastify.register(fastifyView, {
      engine: { handlebars },
      defaultContext: { title: 'Control', subtitle: 'An oAuth2 Server' },
      root: 'views',
      layout: '_layout.hbs',
      options: {
        useHtmlMinifier: htmlMinifier,
        htmlMinifierOptions: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          collapseBooleanAttributes: true,
          removeEmptyElements: true,
          removeEmptyAttributes: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
        },
      },
    });

    await fastify.register(statefulRoutes);
    await fastify.register(statelessRoutes);

    // TODO: Delete later.
    await fastify.register(async function (_fastify) {
      _fastify.get('/callback', async function (_request, _reply) {
        return await _reply.send(_request.query);
      });
    });
    // TODO: Delete later.

    await fastify.ready();
    await fastify.listen({ port: 2875, host: '0.0.0.0' });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

run();
