import 'fastify';

import type { Client, Uri, User } from '../interfaces/models';

declare module 'fastify' {
  interface FastifyRequest {
    client?: Client;
    uri?: Uri;
  }

  interface Session {
    user?: User;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      iss: string;
      aud: string;
      sub: string;
      iat: number;
      exp: number;
      scope?: string;
    };
  }
}
