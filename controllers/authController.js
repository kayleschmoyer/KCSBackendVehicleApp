const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Customer } = require("../models"); // Import the Customer model
const jwt = require("jsonwebtoken");

// Signup a new user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Search for email
    const existingCustomers = await Customer.findAll({
      where: { EMAILADDRESS: { [Op.like]: email.toLowerCase() } },
    });

    if (existingCustomers.length === 0) {
      return res.status(404).json({
        message:
          "You are not in our system. Please contact the store to be added.",
      });
    }

    // Find matching first and last name
    const matchingCustomer = existingCustomers.find(
      (customer) =>
        customer.FIRST_NAME.toLowerCase() === firstName.toLowerCase() &&
        customer.LAST_NAME.toLowerCase() === lastName.toLowerCase()
    );

    if (!matchingCustomer) {
      return res.status(404).json({
        message:
          "Name and email combination not found. Please contact the store.",
      });
    }

    if (matchingCustomer.AppPassword) {
      return res.status(400).json({
        message: "You are already signed up. Please log in.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the hashed password in the database
    matchingCustomer.AppPassword = hashedPassword;
    await matchingCustomer.save();

    res.status(200).json({
      message: "Sign-up successful. You can now log in.",
      customerNumber: matchingCustomer.CUSTOMER_NUMBER,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "An error occurred during sign-up." });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find the user by email
    const customer = await Customer.findOne({
      where: { EMAILADDRESS: { [Op.like]: email.toLowerCase() } },
    });

    if (!customer) {
      return res.status(404).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, customer.AppPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { customerNumber: customer.CUSTOMER_NUMBER }, // Payload includes the customer's unique number
      process.env.JWT_SECRET, // Use your secret key from .env
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

module.exports = {
  signupUser,
  loginUser,
};