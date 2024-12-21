const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

const db = new Sequelize({
  dialect: "mssql",
  host: process.env.DB_HOST, // SQL Server host
  port: process.env.DB_PORT, // SQL Server port
  username: process.env.DB_USER, // SQL Server username
  password: process.env.DB_PASSWORD, // SQL Server password
  database: process.env.DB_NAME, // SQL Server database name
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    },
  },
  logging: console.log,
});

// Test the database connection
(async () => {
  try {
    await db.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = db;