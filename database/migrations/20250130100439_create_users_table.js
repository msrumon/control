/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function ({ schema, fn }) {
  await schema.createTable('users', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function ({ schema }) {
  await schema.dropTable('users');
};
