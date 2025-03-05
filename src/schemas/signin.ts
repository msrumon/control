import type { FastifySchema } from 'fastify';
import Joi from 'joi';

export const getSchema: FastifySchema = {
  querystring: Joi.object({
    next: Joi.string().uri({ relativeOnly: true, encodeUri: true }).required(),
  }),
};

export const postSchema: FastifySchema = {
  ...getSchema,
  body: Joi.object({
    _csrf: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
