const express = require("express");
const router = express.Router();
const { getCustomers } = require("../controllers/customerController");

// Example Route for fetching customers
router.get("/", getCustomers);

module.exports = router;