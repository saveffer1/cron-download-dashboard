exports.seed = async function(knex) {
  // Update users where provider is null or undefined
  await knex('users')
    .whereNull('provider')
    .orWhere('provider', '') // Handle empty strings if any
    .update({ provider: 'local' });

  // Update users where status is null or undefined
  await knex('users')
    .whereNull('status')
    .orWhere('status', '') // Handle empty strings if any
    .update({ status: 'enabled' });

  console.log('Updated existing users with default provider and status.');
};