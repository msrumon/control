import type { FastifyRequest } from 'fastify';

export async function configureRedirectUrl(
  request: FastifyRequest,
  consent: 'no' | 'yes' = 'yes'
) {
  const reqQuery = request.query as Record<string, string>;

  const url = new URL(request.uri!.link);

  switch (consent) {
    case 'no':
      url.searchParams.set('error', 'reject');
      url.searchParams.set(
        'error_description',
        'User rejected authorizing access to the resource(s).'
      );
      break;
    case 'yes':
      const { scope } = request.query as Record<string, string>;
      const scopes = scope
        .split(' ')
        .filter((scope) => scope in request.server.scopes)
        .map((scope) => request.server.scopes[scope]);
      const { user } = request.session;
      // TODO: Find a way to skip certain types if `scope === 'openid'`
      for (const type of reqQuery.response_type.split(' ')) {
        if (type === 'token') {
          const data = {};
          for (const scope of scopes) {
            Object.assign(
              data,
              await request.server.scopes[scope.id].getData(user!.id)
            );
          }
          const { token, time } = await request.server.auth.generateAccessToken(
            {
              aud: request.uri!.id,
              sub: request.session.user?.id,
              scope: reqQuery.scope,
              ...data,
            }
          );
          url.searchParams.set('access_token', token);
          url.searchParams.set('token_type', 'Bearer');
          url.searchParams.set(
            'expires_in',
            ((time - Date.now()) / 1000).toString()
          );
        }

        if (type === 'id_token') {
          const { token } = await request.server.auth.generateIdToken({
            aud: request.client!.id,
            sub: request.session.user?.id,
          });
          url.searchParams.set('id_token', token);
        }

        if (type === 'code') {
          const { code } = await request.server.auth.generateCode(
            request.uri!,
            reqQuery.scope,
            reqQuery.state
          );
          url.searchParams.set('code', code);
        }
      }
      break;
    default:
  }

  if (reqQuery.state) {
    url.searchParams.set('state', reqQuery.state);
  }

  return url.href;
}
