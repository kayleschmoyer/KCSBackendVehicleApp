const { DataTypes } = require("sequelize");
const db = require("../db"); // Import the Sequelize instance

const Vehicle = db.define("Vehicle", {
  CAR_YEAR: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MAKE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MODEL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  VIN_NUMBER: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  CAR_COLOR: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "CAR",
  timestamps: false, // Set to true if the table includes createdAt and updatedAt
});

module.exports = Vehicle;
