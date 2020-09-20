const { PG_CONNECTION_STRING } = process.env

module.exports = {
  development: {
    client: "postgresql",
    connection: PG_CONNECTION_STRING,
    migrations: {
      tableName: "knex_migrations"
    }
  }
}