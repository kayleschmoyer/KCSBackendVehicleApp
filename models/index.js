const Sequelize = require("sequelize");
const sequelize = require("../db"); // Adjust the path if needed
const Customer = require("./Customer");
const Car = require("./Car");
const Class = require("./Class");
const HistHdr = require("./HistHdr");
const HistLine = require("./HistLine");

module.exports = {
  sequelize, // Export sequelize instance
  Sequelize,
  Customer,
  Car,
  Class,
  HistHdr,
  HistLine,
};