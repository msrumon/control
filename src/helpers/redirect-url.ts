import type { FastifyRequest } from 'fastify';

export async function configureRedirectUrl(
  request: FastifyRequest<{ Querystring: Record<string, string> }>,
  consent: 'no' | 'yes' = 'yes'
) {
  const { client, query, server, session, uri } = request;

  const url = new URL(uri!.link);

  switch (consent) {
    case 'no':
      url.searchParams.set('error', 'reject');
      url.searchParams.set(
        'error_description',
        'User rejected authorizing access to the resource(s).'
      );
      break;
    case 'yes':
      const { scope } = query;
      const scopes = server.scope2scopes(scope);
      const { user } = session;
      // TODO: Find a way to skip certain types if `scope === 'openid'`
      for (const type of query.response_type.split(' ')) {
        if (type === 'token') {
          const data = {};
          for (const scope of scopes) {
            Object.assign(
              data,
              await server.scopes[scope.id].getData(user!.id)
            );
          }
          const { token, time } = await server.auth.generateAccessToken({
            aud: uri!.id,
            sub: session.user!.id,
            scope: query.scope,
            ...data,
          });
          url.searchParams.set('access_token', token);
          url.searchParams.set('token_type', 'Bearer');
          url.searchParams.set(
            'expires_in',
            Math.round((time - Date.now()) / 1000).toString()
          );
        }

        if (type === 'id_token') {
          const { token } = await server.auth.generateIdToken({
            aud: client!.id,
            sub: session.user!.id,
          });
          url.searchParams.set('id_token', token);
        }

        if (type === 'code') {
          const { code } = await server.auth.generateCode(
            uri!,
            user!,
            query.scope,
            query.state
          );
          url.searchParams.set('code', code);
        }
      }
      break;
    default:
  }

  if (query.state) {
    url.searchParams.set('state', query.state);
  }

  return url;
}
