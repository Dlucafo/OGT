const initOption = {}
const pgp = require('pg-promise')(initOption);

const connection = {
  host: 'localhost',
  port: 5444,
  database: 'db_tesi',
  user: 'postgres',
  password: 'Da18031990a?',
  max: 30 // use up to 30 connections

  // "types" - in case you want to set custom type parsers on the pool level
};

const db = pgp(connection);

module.exports = {
  pgp,
  db
};