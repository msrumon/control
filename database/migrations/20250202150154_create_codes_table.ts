import type { Knex } from 'knex';

export async function up({ schema }: Knex) {
  await schema.createTable('codes', function (table) {
    table.string('code').notNullable();
    table.uuid('uri_id').references('id').inTable('uris').notNullable();
    table.string('scope').notNullable();
    table.string('state');
    table.datetime('expires_at').notNullable();
    table.timestamps(true, true);
    table.primary(['code', 'uri_id', 'scope']);
  });
}

export async function down({ schema }: Knex) {
  await schema.dropTable('codes');
}
