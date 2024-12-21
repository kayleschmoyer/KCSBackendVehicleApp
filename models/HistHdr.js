const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HistHdr = sequelize.define('HistHdr', {
  InvoiceNumber: { type: DataTypes.STRING, allowNull: false },
  TotalPrice: { type: DataTypes.FLOAT, allowNull: false },
  Vehicle: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'HistHdr',
  timestamps: false,
});

module.exports = HistHdr;