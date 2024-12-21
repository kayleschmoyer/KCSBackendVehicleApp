const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const db = require("./db"); // Sequelize database connection
const authRoutes = require("./routes/authRoutes"); // Authentication routes
const customerRoutes = require("./routes/customerRoutes"); // Customer routes (if needed)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

// Test database connection and sync
(async () => {
  try {
    await db.authenticate();
    console.log("Database connection established successfully.");

    // Sync all models
    await db.sync({ alter: false, force: false });
    console.log("Database synchronized.");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();
