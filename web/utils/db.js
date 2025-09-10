const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: "db",
    user: "postgres",
    password: "secret",
    database: "test"
  }
});

module.exports = db;
