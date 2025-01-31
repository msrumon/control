import Joi from 'joi';

/**
 * @type {import('fastify').FastifySchema}
 */
export const getSigninSchema = {
  querystring: Joi.object({
    next: Joi.string().uri({ relativeOnly: true, encodeUri: true }).required(),
  }),
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const postSigninSchema = {
  ...getSigninSchema,
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    _csrf: Joi.string().required(),
  }),
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const getAuthorizeSchema = {
  querystring: Joi.object({
    response_type: Joi.string()
      .valid(...['code'])
      .required(),
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().uri({ encodeUri: true }).required(),
    scope: Joi.string()
      .valid(...['openid'])
      .required(),
    state: Joi.string(),
  }),
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const postAuthorizeSchema = { ...getAuthorizeSchema };
