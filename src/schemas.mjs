/**
 * @type {import('fastify').FastifySchema}
 */
export const getAuthorizeSchema = {
  querystring: {
    type: 'object',
    properties: {
      response_type: { enum: ['code'] },
      client_id: { type: 'string' },
      redirect_uri: { type: 'string' },
      scope: { enum: ['openid'] },
      state: { type: 'string' },
    },
    required: ['response_type', 'client_id', 'redirect_uri', 'scope'],
    additionalProperties: false,
  },
};
