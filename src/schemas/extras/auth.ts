import type { FastifySchema } from 'fastify';
import Joi from 'joi';

export default {
  headers: Joi.object({
    Authorization: Joi.string().pattern(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/),
  }).unknown(true),
} as FastifySchema;
