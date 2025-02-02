/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function ({ schema, fn }) {
  await schema.createTable('codes', function (table) {
    table.string('code').notNullable();
    table.uuid('client_id').references('id').inTable('clients').notNullable();
    table.uuid('uri_id').references('id').inTable('uris').notNullable();
    table.uuid('scope_id').references('id').inTable('scopes').notNullable();
    table.string('state');
    table.datetime('created_at').defaultTo(fn.now());
    table.datetime('expires_at').notNullable();
    table.primary(['code', 'scope_id']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function ({ schema }) {
  await schema.dropTable('codes');
};
