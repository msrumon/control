import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { User } from '../../interfaces/models';
import type { GetSigninRoute, PostSigninRoute } from '../../interfaces/routes';

export async function getHandler(
  this: FastifyInstance,
  request: FastifyRequest<GetSigninRoute>,
  reply: FastifyReply
) {
  const { next } = request.query;

  const { user: exUser } = request.session;
  if (exUser) {
    return await reply.redirect(decodeURIComponent(next));
  }

  return await reply.viewAsync('signin', {
    _csrf: reply.generateCsrf(),
    error: reply.flash('error'),
  });
}

export async function postHandler(
  this: FastifyInstance,
  request: FastifyRequest<PostSigninRoute>,
  reply: FastifyReply
) {
  const { next } = request.query;

  const { user: exUser } = request.session;
  if (!exUser) {
    const { username, password } = request.body;

    const dbUser = await this.knex<User>('users')
      .where('name', username)
      .first();
    if (!dbUser) {
      request.flash('error', 'Username does not exist.');
      return await reply.redirect(request.url);
    }

    if (!(await this.argon2.verify(dbUser.password, password))) {
      request.flash('error', 'Password does not match.');
      return await reply.redirect(request.url);
    }

    request.session.user = dbUser;
  }

  return await reply.redirect(decodeURIComponent(next));
}
