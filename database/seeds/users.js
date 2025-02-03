/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  await knex('users')
    .insert([
      {
        id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
        username: 'bendover',
        email: 'bendover@example.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$8i8X4VDBEvq3RhMP6+1pTw$hHYd52T0htao1oEaVlBuXCBvO5HWPJAcV+c8iOIWZEI', // 'bendover'
      },
    ])
    .onConflict('id')
    .ignore();
};
