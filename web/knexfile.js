const env = require('./utils/config')

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: "cronjob_db"
    },
    migrations: {
      directory: "./migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
