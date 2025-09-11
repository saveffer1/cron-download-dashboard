exports.up = function(knex) {
  return knex.schema.createTable('sessions', (table) => {
    table.string('sid').primary();
    table.json('sess').notNullable();
    table.timestamp('expired').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('sessions');
};
