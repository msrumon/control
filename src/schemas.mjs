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
    _csrf: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const getAuthorizeSchema = {
  querystring: Joi.object({
    response_type: Joi.string()
      .custom((value, helpers) => {
        const allowedTypes = ['token', 'id_token', 'code'];
        if (
          !allowedTypes.some((type) => value.includes(type)) ||
          value.split(' ').filter((s) => !allowedTypes.includes(s)).length > 0
        ) {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .required(),
    client_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    redirect_uri: Joi.string().uri({ encodeUri: true }).required(),
    scope: Joi.string().required(),
    state: Joi.string(),
  }),
};

/**
 * @type {import('fastify').FastifySchema}
 */
export const postAuthorizeSchema = {
  ...getAuthorizeSchema,
  body: Joi.object({
    _csrf: Joi.string().required(),
    consent: Joi.boolean().truthy('yes').falsy('no').required(),
  }),
};
