const express = require("express");
const router = express.Router();
const { fetchCustomerCars, fetchVehicleHistory } = require("../controllers/vehicleController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, fetchCustomerCars);
router.get("/history", authenticateToken, fetchVehicleHistory); // New route

module.exports = router;