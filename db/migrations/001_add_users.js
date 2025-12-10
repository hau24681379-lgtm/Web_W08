export async function up(knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('username', 50).notNullable().unique();
    t.string('password', 120).notNullable();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable().unique();
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('users');
}