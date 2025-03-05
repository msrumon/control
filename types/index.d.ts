import 'fastify';

type DbRecord = Record<string, string>;

declare module 'fastify' {
  interface FastifyRequest {
    client?: DbRecord;
    uri?: DbRecord;
  }

  interface Session {
    user?: DbRecord;
  }
}
