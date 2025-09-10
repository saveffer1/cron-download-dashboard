const bcrypt = require("bcrypt");
const env = require('../utils/config');
const logger = require('../utils/logger');

exports.seed = async function(knex) {
  const username = "admin";
  const password = env.ADMIN_PASSWORD || "changeme";
  const role = "admin";

  const saltRounds = 12;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const existing = await knex("users").where({ username }).first();

  if (existing) {
    await knex("users")
      .where({ username })
      .update({
        password_hash,
        role,
      });
    logger.info(`Admin password updated for user: ${username}`);
  } else {
    // แทรกใหม่
    await knex("users").insert({
      username,
      password_hash,
      role,
    });
    logger.info(`Admin user created: ${username}`);
  }
};
