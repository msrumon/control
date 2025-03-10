import type { Knex } from 'knex';

export async function seed(knex: Knex) {
  await knex('clients')
    .insert([
      {
        id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
        name: 'Extraterrestrial Being',
        type: 'private',
        secret: '',
      },
    ])
    .onConflict('id')
    .ignore();
}
