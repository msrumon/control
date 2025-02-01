/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex('scopes').insert([
    {
      id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
      name: 'openid',
      description: 'Authenticate yourself',
      is_consent_requried: false,
    },
    {
      id: 'a1b2c3d4-e5f6-4002-abcd-a1b2c3d4e5f6',
      name: 'email',
      description: 'Access to your email',
      is_consent_requried: true,
    },
    {
      id: 'a1b2c3d4-e5f6-4003-abcd-a1b2c3d4e5f6',
      name: 'profile',
      description: 'Access to your profile',
      is_consent_requried: true,
    },
  ]);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex('scopes').delete();
};
