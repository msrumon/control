import type { FastifySchema } from 'fastify';
import Joi from 'joi';

export const getSchema = {
  querystring: Joi.object({
    next: Joi.string().uri({ relativeOnly: true, encodeUri: true }).required(),
  }),
} as FastifySchema;

export const postSchema = {
  ...getSchema,
  body: Joi.object({
    _csrf: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
} as FastifySchema;
