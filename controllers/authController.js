const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Customer } = require("../models"); // Import the Customer model

// Signup a new user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user exists in the database
    const existingCustomer = await Customer.findOne({
      where: {
        [Op.and]: [
          { FIRST_NAME: { [Op.like]: firstName.toLowerCase() } }, // Case-insensitive match
          { LAST_NAME: { [Op.like]: lastName.toLowerCase() } },
          { EMAILADDRESS: { [Op.like]: email.toLowerCase() } },
        ],
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        message:
          "You are not in our system. Please contact the store to be added.",
      });
    }

    if (existingCustomer.AppPassword) {
      return res.status(400).json({
        message: "You are already signed up. Please log in.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    existingCustomer.AppPassword = hashedPassword;
    await existingCustomer.save();

    res.status(200).json({ message: "Sign-up successful. You can now log in." });
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

    // Respond with success message or JWT token
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

module.exports = {
  signupUser,
  loginUser,
};