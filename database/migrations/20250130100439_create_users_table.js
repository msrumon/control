/**
 * @param {import('knex').Knex} knex
 */
exports.up = async ({ schema }) => {
  await schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async ({ schema }) => {
  await schema.dropTable('users');
};
