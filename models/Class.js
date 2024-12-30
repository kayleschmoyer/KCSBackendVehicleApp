const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Class = sequelize.define(
  "Class",
  {
    Class: { type: DataTypes.INTEGER, primaryKey: true },
    DESCRIPTION: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "CLASS",
    timestamps: false,
  }
);

module.exports = Class;