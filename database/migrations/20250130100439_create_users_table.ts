import type { Knex } from 'knex';

export async function up({ schema, fn }: Knex) {
  await schema.createTable('users', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table.string('name').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
}

export async function down({ schema }: Knex) {
  await schema.dropTable('users');
}
