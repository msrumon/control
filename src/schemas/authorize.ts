import type { FastifySchema } from 'fastify';
import Joi from 'joi';

export const getSchema: FastifySchema = {
  querystring: Joi.object({
    response_type: Joi.string()
      .custom((value: string, helpers) => {
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

export const postSchema: FastifySchema = {
  ...getSchema,
  body: Joi.object({
    _csrf: Joi.string().required(),
    consent: Joi.boolean().truthy('yes').falsy('no').required(),
  }),
};
