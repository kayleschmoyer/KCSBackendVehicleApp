const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  port: 1433,
};

async function connectToDB() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to SQL Server successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

connectToDB();