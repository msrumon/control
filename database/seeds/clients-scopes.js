/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  await knex('clients_scopes').delete();
  await knex('clients_scopes').insert([
    {
      client_id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
      scope_id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
    },
    {
      client_id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
      scope_id: 'a1b2c3d4-e5f6-4002-abcd-a1b2c3d4e5f6',
    },
  ]);
};
