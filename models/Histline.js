const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Histline = sequelize.define('Histline', {
  InvoiceNumber: { type: DataTypes.STRING, allowNull: false },
  ItemName: { type: DataTypes.STRING, allowNull: false },
  Quantity: { type: DataTypes.INTEGER, allowNull: false },
  Price: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'Histline',
  timestamps: false,
});

module.exports = Histline;