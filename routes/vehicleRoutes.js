const express = require("express");
const router = express.Router();
const { fetchCustomerCars } = require("../controllers/vehicleController");
const authenticateToken = require("../middleware/authMiddleware"); // Import the auth middleware

// Route to fetch all vehicles for a customer
router.get("/", authenticateToken, fetchCustomerCars);

module.exports = router;