import type { FastifySchema } from 'fastify';
import Joi from 'joi';

import authSchema from './extras/auth';

export const postSchema = {
  ...authSchema,
  body: Joi.object({ token: Joi.string().required() }),
} as FastifySchema;
