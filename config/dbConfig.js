const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER.split("\\")[0], // Extract the host (e.g., "localhost")
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 1433, // Use DB_PORT or default to 1433
  options: {
    encrypt: false, // For Azure SQL, set to true
    trustServerCertificate: true, // For local development
    enableArithAbort: true,
  },
};

// Create and export a connection pool
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server successfully");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    throw err;
  });

module.exports = { poolPromise, sql };