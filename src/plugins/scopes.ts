import fastifyPlugin from 'fastify-plugin';

import emailScope from '../logic/email.scope';
import profileScope from '../logic/profile.scope';

type Scopes = {
  [key: string]: {
    id: string;
    description: string;
    getData: (id: string) => Promise<Record<string, string> | undefined>;
  };
};

declare module 'fastify' {
  interface FastifyInstance {
    scopes: Scopes;
    scope2scopes: (scope: string) => Array<Scopes[keyof Scopes]>;
  }
}

export const scopesPlugin = fastifyPlugin(async (fastify) => {
  fastify.decorate('scopes', {
    email: emailScope(fastify),
    profile: profileScope(fastify),
  });
  fastify.decorate('scope2scopes', (scope: string) =>
    scope
      .split(' ')
      .filter((s) => s in fastify.scopes)
      .map((s) => fastify.scopes[s])
  );
});
