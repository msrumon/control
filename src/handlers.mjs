/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function getSigninHandler(request, reply) {
  const { next } = request.query;

  const { user: exUser } = request.session;
  if (exUser) {
    return await reply.redirect(decodeURIComponent(next));
  }

  return await reply.viewAsync('signin', { _csrf: reply.generateCsrf() });
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
      throw reply.server.httpErrors.notFound();
    }

    if (!(await request.server.argon2.verify(dbUser.password, password))) {
      throw reply.server.httpErrors.notFound();
    }

    request.session.user = dbUser;
  }

  return await reply.redirect(decodeURIComponent(next));
}

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function getAuthorizeHandler(request, reply) {
  const { user: exUser } = request.session;
  if (!exUser) {
    return await reply.redirect(
      `/signin?next=${encodeURIComponent(request.url)}`
    );
  }

  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  } = request.query;
  // TODO: Check `clientId` against the list of registered clients.
  // TODO: Check `redirectUri` against the list of allowed redirect URIs.
  // TODO: Check `scope` against the list of allowed scopes.
  // TODO: Generate a random `code` and store it in the database.
  // TODO: Redirect the user to `redirectUri` with the `code` and `state`.
  console.log({ responseType, clientId, redirectUri, scope, state });
  return await reply.viewAsync('consent', {
    client: 'Test Client',
    scopes: [
      { name: 'email', description: 'Access to your email' },
      { name: 'profile', description: 'Access to your profile' },
    ],
  });
}

/**
 * @type {import('fastify').RouteHandlerMethod}
 */
export async function postAuthorizeHandler(request, reply) {
  const { user: exUser } = request.session;
  if (!exUser) {
    return await reply.redirect(
      `/signin?next=${encodeURIComponent(request.url)}`
    );
  }

  // TODO: Check `clientId` against the list of registered clients.
  // TODO: Check `redirectUri` against the list of allowed redirect URIs.
  // TODO: Check `scope` against the list of allowed scopes.
  // TODO: Generate a random `code` and store it in the database.
  // TODO: Redirect the user to `redirectUri` with the `code` and `state`.
  return await reply.redirect(redirectUri);
}
