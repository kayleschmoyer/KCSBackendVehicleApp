const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HistHdr = sequelize.define('HistHdr', {
  INVOICE_NUMBER: { type: DataTypes.STRING, allowNull: false },
  TOTAL_SALE_AMOUNT: { type: DataTypes.FLOAT, allowNull: false },
  VIN_NUMBER: { type: DataTypes.STRING, allowNull: true },
  
  // ✅ ADD THESE FIELDS (you confirmed they exist in SQL)
  CAR_YEAR: { type: DataTypes.INTEGER, allowNull: true },
  MAKE: { type: DataTypes.STRING, allowNull: true },
  MODEL: { type: DataTypes.STRING, allowNull: true },

}, {
  tableName: 'HistHdr',
  timestamps: false,
});

module.exports = HistHdr;
