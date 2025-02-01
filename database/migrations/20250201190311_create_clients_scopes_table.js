/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function ({ schema, fn }) {
  await schema.createTable('clients_scopes', function (table) {
    table.uuid('client_id').notNullable();
    table.uuid('scope_id').notNullable();
    table.primary(['client_id', 'scope_id']);
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function ({ schema }) {
  await schema.dropTable('clients_scopes');
};
