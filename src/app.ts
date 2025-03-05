import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyEnv from '@fastify/env';
import fastifyFlash from '@fastify/flash';
import fastifyFormbody from '@fastify/formbody';
import fastifyJwt from '@fastify/jwt';
import fastifySensible from '@fastify/sensible';
import fastifySession from '@fastify/session';
import fastifyView from '@fastify/view';

import Fastify from 'fastify';
import handlebars from 'handlebars';

import knexConfig from '../knexfile';
import { argon2Plugin } from './plugins/argon2';
import { authPlugin } from './plugins/auth';
import { knexPlugin } from './plugins/knex';
import { scopesPlugin } from './plugins/scopes';
import { routes as statefulRoutes } from './routes/stateful';
import { routes as statelessRoutes } from './routes/stateless';

import { routes as clientRoutes } from './routes/!client';

const fastify = Fastify({ logger: true });

async function run() {
  fastify.setValidatorCompiler<Record<string, Function>>(
    ({ schema }) =>
      (input) =>
        schema.validateAsync(input, { context: { fastify } })
  );

  fastify.setErrorHandler(async (error, _request, reply) => {
    fastify.log.warn(error);
    const { message, name, statusCode } = error;
    if (!statusCode) {
      return await reply.code(500).viewAsync('error', {
        name: 'ServerError',
        message: 'Something went wrong.',
      });
    }
    return await reply.code(statusCode).viewAsync('error', { message, name });
  });

  try {
    await fastify.register(fastifyEnv, {
      schema: {
        type: 'object',
        properties: {
          COOKIE_SECRET: { type: 'string' },
          SESSION_SECRET: { type: 'string', minLength: 32 },
          JWT_SECRET: { type: 'string' },
        },
        required: ['COOKIE_SECRET', 'SESSION_SECRET', 'JWT_SECRET'],
      },
    });
    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET as string,
    });
    await fastify.register(knexPlugin, { ...knexConfig });
    await fastify.register(fastifySession, {
      secret: process.env.SESSION_SECRET as string,
      cookie: { httpOnly: true, secure: 'auto' },
    });
    await fastify.register(fastifyCsrfProtection);
    await fastify.register(fastifyCors);
    await fastify.register(fastifyView, {
      engine: { handlebars },
      defaultContext: { title: 'Control', subtitle: 'An oAuth2 Server' },
      root: 'views',
      layout: '_layout.hbs',
      options: {
        useHtmlMinifier: require('html-minifier-terser'),
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
    await fastify.register(fastifyFormbody);
    await fastify.register(fastifyFlash);
    await fastify.register(fastifyJwt, {
      secret: process.env.JWT_SECRET as string,
      sign: { iss: 'https://control.msrumon.com' },
      verify: { allowedIss: 'https://control.msrumon.com' },
    });
    await fastify.register(fastifySensible);
    await fastify.register(argon2Plugin);
    await fastify.register(authPlugin);
    await fastify.register(scopesPlugin);

    await fastify.register(statefulRoutes);
    await fastify.register(statelessRoutes);

    await fastify.register(clientRoutes);

    await fastify.ready();
    await fastify.listen({ port: 2875, host: '0.0.0.0' });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

run();
