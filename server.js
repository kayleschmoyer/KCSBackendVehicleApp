const express = require("express");
const dotenv = require("dotenv");
const db = require("./db"); // Import Sequelize instance
const customerRoutes = require("./routes/customerRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes"); // Import vehicle routes
const authRoutes = require("./routes/authRoutes");
const cors = require("cors"); // Import cors

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));

// Middleware
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes); // Register the vehicle routes
app.use("/api/auth", authRoutes);

// Start server
(async () => {
  try {
    await db.authenticate(); // Test the connection
    console.log("Connection to the database has been established successfully.");
    await db.sync(); // Sync models with the database
    console.log("Database synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();