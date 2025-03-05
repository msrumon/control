import type { Knex } from 'knex';

export async function up({ schema, fn }: Knex) {
  await schema.createTable('clients', function (table) {
    table.uuid('id').primary().defaultTo(fn.uuid());
    table
      .enum('type', ['private', 'public'], {
        useNative: true,
        enumName: 'clients_types',
      })
      .notNullable();
    table.string('secret');
    table.string('name').notNullable();
    // TODO: Handle allowed scopes so that the consent page isn't shown for scopes that have already been allowed.
    table.timestamps(true, true);
  });
}

export async function down({ schema }: Knex) {
  await schema.dropTable('clients');
}
