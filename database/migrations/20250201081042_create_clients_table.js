/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function ({ schema, fn }) {
  await schema.createTable('clients', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table
      .enum('type', ['private', 'public'], {
        useNative: true,
        enumName: 'clients_types',
      })
      .notNullable();
    table.string('secret');
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function ({ schema }) {
  await schema.dropTable('clients');
};
