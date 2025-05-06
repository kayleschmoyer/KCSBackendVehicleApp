// models/Estimate.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");  // ← use your Sequelize instance directly

const Estimate = sequelize.define(
  "Estimate",
  {
    estimateNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: "ESTIMATE_NUMBER",
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "STATUS",
    },
    customerNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "CUSTOMER_NUMBER",
    },
    carYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "CAR_YEAR",
    },
    make: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "MAKE",
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "MODEL",
    },
    licNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "LIC_NUMBER",
    },
  },
  {
    tableName: "ESTMTEHDR",
    timestamps: false,
  }
);

module.exports = Estimate;
