const express = require("express");
const router = express.Router();
const { getInvoiceData } = require("../controllers/dataController");

// Fetch Invoice data endpoint
router.get("/invoices", getInvoiceData);

module.exports = router;