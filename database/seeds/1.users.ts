import { hash } from 'argon2';
import type { Knex } from 'knex';

export async function seed(knex: Knex) {
  await knex('users')
    .insert([
      {
        id: 'a1b2c3d4-e5f6-4001-abcd-a1b2c3d4e5f6',
        name: 'bendover',
        email: 'bendover@example.com',
        password: await hash('bendover'),
      },
    ])
    .onConflict('id')
    .ignore();
}
