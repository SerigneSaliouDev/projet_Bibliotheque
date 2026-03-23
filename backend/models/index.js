const sequelize = require("../config/database");



const Book = require("./Book");
let Category;
try {
  Category = require("./Category");
} catch (e) {
  Category = null;
}

const db = {
  sequelize,
  Book,
  Category
};


if (Category) {
  Book.belongsTo(Category, { foreignKey: "category_id", as: "category" });
  Category.hasMany(Book, { foreignKey: "category_id", as: "books" });
}

module.exports = db;
