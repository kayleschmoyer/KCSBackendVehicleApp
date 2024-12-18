const express = require("express");
const router = express.Router();
const { getInvoiceData, getVehicles } = require("../controllers/dataController");
const authenticateToken = require("../middleware/authMiddleware");

// Fetch Invoice data endpoint
router.get("/invoices", getInvoiceData);
router.get("/vehicles", authenticateToken, getVehicles);

module.exports = router;