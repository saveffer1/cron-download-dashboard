/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Updates all existing users to have a status of 'enabled' if they don't have one.
  return knex('users').whereNull('status').update({ status: 'enabled' });
};