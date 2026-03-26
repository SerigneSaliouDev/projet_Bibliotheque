const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Borrow = sequelize.define(
  "Borrow",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    borrow_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      allowNull: false,
      defaultValue: "borrowed"
    }
  },
  {
    tableName: "borrows"
  }
);

module.exports = Borrow;