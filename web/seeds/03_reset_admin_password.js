const bcrypt = require("bcrypt");
const logger = require('../utils/logger');

exports.seed = async function(knex) {
  const username = "admin";
  const newPassword = "admin123";

  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  await knex("users")
    .where({ username })
    .update({ password_hash: newPasswordHash });

  logger.info(`Admin password reset to '${newPassword}' for user: ${username}`);
};