/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function ({ schema, fn }) {
  await schema.createTable('scopes', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.boolean('is_consent_requried').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function ({ schema }) {
  await schema.dropTable('scopes');
};
