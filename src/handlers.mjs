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
    return await reply.notFound('Client not found.');
  }

  const uri = await request.server
    .knex('uris')
    .where('client_id', client.id)
    .first();
  if (!uri) {
    return await reply.notFound('URI not found.');
  }
  if (uri.link !== decodeURIComponent(redirectUri)) {
    return await reply.badRequest('URI mismatched.');
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

  for (const type of responseType.split(' ')) {
    if (type === 'token') {
      const { token, time } = await request.server.auth.generateAccessToken();
      url.searchParams.set('access_token', token);
      url.searchParams.set('token_type', 'Bearer');
      url.searchParams.set('expires_in', (time - new Date()) / 1000);
    }

    if (type === 'id_token') {
      const { token } = await request.server.auth.generateIdToken();
      url.searchParams.set('id_token', token);
    }

    if (type === 'code') {
      const { code } = await request.server.auth.generateCode(
        request.client,
        request.uri,
        request.scopes,
        state
      );
      url.searchParams.set('code', code);
    }
  }

  if (state) {
    url.searchParams.set('state', state);
  }

  return await reply.redirect(url);
}

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function postAuthorizeHandler(request, reply) {
  const { response_type: responseType, state } = request.query;
  const { consent } = request.body;

  const url = new URL(request.uri.link);

  switch (consent) {
    case 'no':
      url.searchParams.set('error', 'reject');
      url.searchParams.set(
        'error_description',
        'User rejected authorizing access to the resource(s).'
      );
      break;
    case 'yes':
      for (const type of responseType.split(' ')) {
        if (type === 'token') {
          const { token, time } =
            await request.server.auth.generateAccessToken();
          url.searchParams.set('access_token', token);
          url.searchParams.set('token_type', 'Bearer');
          url.searchParams.set('expires_in', (time - new Date()) / 1000);
        }

        if (type === 'id_token') {
          const { token } = await request.server.auth.generateIdToken();
          url.searchParams.set('id_token', token);
        }

        if (type === 'code') {
          const { code } = await request.server.auth.generateCode(
            request.client,
            request.uri,
            request.scopes,
            state
          );
          url.searchParams.set('code', code);
        }
      }
      break;
    default:
  }

  if (state) {
    url.searchParams.set('state', state);
  }

  return await reply.redirect(url);
}
