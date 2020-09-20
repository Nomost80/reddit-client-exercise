
exports.up = function(knex) {
  return knex.schema.createTable("bookmarks", function(table) {
    table.increments("id");
    table.string("user_id", 255).notNullable();
    table.string("sr_id", 255).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("bookmarks");
};
