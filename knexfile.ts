/**
 * @type {import('knex').Config}
 */
export default {
  client: 'better-sqlite3',
  connection: { filename: './data.db' },
  migrations: { directory: './database/migrations', tableName: '_migrations' },
  seeds: { directory: './database/seeds' },
  useNullAsDefault: true,
};
