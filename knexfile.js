/**
 * @type {import('knex').Knex.Config}
 */
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: { directory: './database/migrations', tableName: '_migrations' },
  seeds: { directory: './database/seeds' },
};
