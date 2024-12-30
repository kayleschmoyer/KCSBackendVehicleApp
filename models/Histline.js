const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Class = require("./Class");

const HistLine = sequelize.define(
  "HistLine",
  {
    INVOICE_NUMBER: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    CLASS: { type: DataTypes.INTEGER, allowNull: false },
    QUANTITY: { type: DataTypes.FLOAT, allowNull: false },
    SELL_PRICE: { type: DataTypes.FLOAT, allowNull: false },
    DECLINED: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "HistLine",
    timestamps: false,
  }
);

// Define association with Class
HistLine.belongsTo(Class, {
  foreignKey: "CLASS", // Foreign key in HistLine
  targetKey: "Class",  // Primary key in Class
});

module.exports = HistLine;