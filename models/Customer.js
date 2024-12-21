const { DataTypes } = require("sequelize");
const db = require("../db");

const Customer = db.define(
  "Customer",
  {
    CUSTOMER_NUMBER: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    FIRST_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LAST_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EMAILADDRESS: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    AppPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Customer",
    timestamps: false, // Disable timestamps if they are not present
  }
);

module.exports = Customer;