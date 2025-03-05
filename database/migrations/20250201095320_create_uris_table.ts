import type { Knex } from 'knex';

export async function up({ schema, fn }: Knex) {
  await schema.createTable('uris', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table.string('link').notNullable();
    table.uuid('client_id').references('id').inTable('clients').notNullable();
    table.timestamps(true, true);
  });
}

export async function down({ schema }: Knex) {
  await schema.dropTable('uris');
}
