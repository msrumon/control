/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function ({ schema, fn }) {
  await schema.createTable('uris', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table.string('link').notNullable();
    table.uuid('client_id').references('id').inTable('clients').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function ({ schema }) {
  await schema.dropTable('uris');
};
