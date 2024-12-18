const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const listEndpoints = require("express-list-endpoints");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route Mounting: Combine routes under "/api"
app.use("/api", authRoutes); // Auth endpoints like /api/login, /api/register
app.use("/api", dataRoutes); // Data endpoints like /api/vehicles

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Available routes:", listEndpoints(app));
});