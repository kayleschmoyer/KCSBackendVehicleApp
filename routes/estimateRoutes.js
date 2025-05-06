// routes/estimateRoutes.js
const express = require("express");
const router = express.Router();
const estimateCtrl = require("../controllers/estimateController");

// GET /api/estimates?customerId=12345
router.get("/", estimateCtrl.getEstimateData);

module.exports = router;
