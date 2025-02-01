import { randomBytes } from 'node:crypto';

/**
 * @type {import('fastify').preHandlerAsyncHookHandler}
 */
export async function handleAuth(request, reply) {
  const { user: exUser } = request.session;
  if (!exUser) {
    return await reply.redirect(
      `/signin?next=${encodeURIComponent(request.url)}`
    );
  }

  const {
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
  } = request.query;

  const client = await request.server
    .knex('clients')
    .where('id', clientId)
    .first();
  if (!client) {
    return await reply.notFound('No client found!');
  }

  const uri = await request.server
    .knex('uris')
    .where('client_id', client.id)
    .first();
  if (uri.link !== decodeURIComponent(redirectUri)) {
    return await reply.badRequest('URI mismatched!');
  }

  request.client = client;
  request.uri = uri;
  request.scopes = await request.server
    .knex('scopes')
    .join('clients_scopes', 'scopes.id', 'clients_scopes.scope_id')
    .where('clients_scopes.client_id', client.id)
    .andWhere('scopes.name', 'in', scope.split(' '))
    .select('scopes.*');
}

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function getSigninHandler(request, reply) {
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

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function postSigninHandler(request, reply) {
  const { next } = request.query;

  const { user: exUser } = request.session;
  if (!exUser) {
    const { username, password } = request.body;

    const dbUser = await request.server
      .knex('users')
      .where('username', username)
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
}

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function getAuthorizeHandler(request, reply) {
  const { response_type: responseType, state } = request.query;

  if (request.scopes.some((scope) => scope.is_consent_requried)) {
    return await reply.viewAsync('consent', {
      _csrf: reply.generateCsrf(),
      client: request.client,
      scopes: request.scopes.filter((scope) => scope.is_consent_requried),
    });
  }

  const url = new URL(request.uri.link);

  switch (responseType) {
    case 'code':
      // TODO: Generate a random "code" and store it in the database.
      const code = randomBytes(32).toString('hex');
      url.searchParams.set('code', code);
      if (state) {
        url.searchParams.set('state', state);
      }
      break;
  }

  return await reply.redirect(url);
}

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function postAuthorizeHandler(request, reply) {
  // TODO
  return await reply.notImplemented();

  const { response_type: responseType, state } = request.query;

  const url = new URL(request.uri.link);

  switch (responseType) {
    case 'code':
      // TODO: Generate a random "code" and store it in the database.
      const code = randomBytes(32).toString('hex');
      url.searchParams.set('code', code);
      if (state) {
        url.searchParams.set('state', state);
      }
      break;
  }

  return await reply.redirect(url);
}
