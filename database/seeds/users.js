/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async (knex) => {
  await knex('users').delete();
  await knex('users').insert([
    {
      username: 'johndoe',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$+PoUoJ+mr8UvW/ki/ssWwg$ln2XmUKWwX5YAMRYyP3HBO9zgL7DnFONnvdbJ7p6378', // 'johndoe'
    },
    {
      username: 'janedoe',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$woFJeWCUVfhLDqjwdZW3UA$G3i3DT/edqFHzzgMGmVhUNT9BpYACq9up5y2cPRMEUA', // 'janedoe'
    },
    {
      username: 'bendover',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$8i8X4VDBEvq3RhMP6+1pTw$hHYd52T0htao1oEaVlBuXCBvO5HWPJAcV+c8iOIWZEI', // 'bendover'
    },
  ]);
};
