exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('login_method').defaultTo('local').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('login_method');
  });
};