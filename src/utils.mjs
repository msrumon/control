/**
 * @type {import('fastify').FastifySchemaCompiler}
 */
export function validatorCompiler({ schema }) {
  return async function (input) {
    return schema.validate(input);
  };
}
