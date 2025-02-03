/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  await knex('uris')
    .insert([
      {
        id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
        link: 'http://127.0.0.1:2875/callback',
        client_id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
      },
    ])
    .onConflict('id')
    .ignore();
};
