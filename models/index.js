const Sequelize = require("sequelize");
const sequelize = require("../db"); // Adjust the path if needed
const Customer = require("./Customer");
const Car = require("./Car");
const HistHdr = require("./HistHdr");

module.exports = {
  sequelize, // Export sequelize instance
  Sequelize,
  Customer,
  Car,
  HistHdr,
};