exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.renameColumn('login_method', 'provider');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.renameColumn('provider', 'login_method');
  });
};