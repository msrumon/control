import type { FastifySchema } from 'fastify';
import Joi from 'joi';

export const postSchema = {
  body: Joi.object({
    code: Joi.string().required(),
    client_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    redirect_uri: Joi.string().uri({ encodeUri: true }).required(),
    state: Joi.string(),
  }),
} as FastifySchema;
