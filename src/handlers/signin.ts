import type { RouteHandlerMethod } from 'fastify';

export const getHandler: RouteHandlerMethod = async (request, reply) => {
  const { next } = request.query as Record<string, string>;

  const { user: exUser } = request.session;
  if (exUser) {
    return await reply.redirect(decodeURIComponent(next));
  }

  return await reply.viewAsync('signin', {
    _csrf: reply.generateCsrf(),
    error: reply.flash('error'),
  });
};

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export const postHandler: RouteHandlerMethod = async (request, reply) => {
  const { next } = request.query as Record<string, string>;

  const { user: exUser } = request.session;
  if (!exUser) {
    const { username, password } = request.body as Record<string, string>;

    const dbUser = await request.server
      .knex('users')
      .where('name', username)
      .first();
    if (!dbUser) {
      request.flash('error', 'Username does not exist.');
      return await reply.redirect(request.url);
    }

    if (!(await request.server.argon2.verify(dbUser.password, password))) {
      request.flash('error', 'Password does not match.');
      return await reply.redirect(request.url);
    }

    request.session.user = dbUser;
  }

  return await reply.redirect(decodeURIComponent(next));
};
