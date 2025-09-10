const knex = require("knex");
const config = require("../knexfile");
const env = require('./config');

const db = knex(config[env.NODE_ENV]);

module.exports = db;
