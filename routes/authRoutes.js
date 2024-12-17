const express = require("express");
const router = express.Router();
const { loginUser, signupUser } = require("../controllers/authController");

// Login endpoint
router.post("/login", loginUser);

// Signup endpoint
router.post("/signup", signupUser);

module.exports = router;