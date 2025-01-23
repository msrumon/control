import type { RouteHandlerMethod } from 'fastify';

export const getAuthorizeHandler: RouteHandlerMethod = async (
  request,
  reply
) => {
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  } = request.query as any;
  // TODO: Check if the user is authenticated.
  // TODO: Check `clientId` against the list of registered clients.
  // TODO: Check `redirectUri` against the list of allowed redirect URIs.
  // TODO: Check `scope` against the list of allowed scopes.
  // TODO: Generate a random `code` and store it in the database.
  // TODO: Redirect the user to `redirectUri` with the `code` and `state`.
  console.log({ responseType, clientId, redirectUri, scope, state });
  return await reply.code(204).send();
};
