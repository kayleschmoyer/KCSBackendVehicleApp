const bcrypt = require("bcrypt");
const sql = require("mssql");
const jwt = require("jsonwebtoken");

// Signup User
exports.signupUser = async (req, res) => {
  const { customerNumber, firstName, lastName, email, password } = req.body;

  if (!customerNumber || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const pool = await sql.connect();

    // Check if user exists and AppPassword is already set
    const checkQuery = `
      SELECT AppPassword 
      FROM Customer 
      WHERE CUSTOMER_NUMBER = @customerNumber
    `;

    const result = await pool
      .request()
      .input("customerNumber", sql.VarChar, customerNumber)
      .query(checkQuery);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "You are not in our system. Please contact the store to be added.",
      });
    }

    const user = result.recordset[0];

    if (user.AppPassword) {
      return res.status(400).json({
        message: "You are already signed up. Please log in.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update AppPassword for the user
    const updateQuery = `
      UPDATE Customer 
      SET AppPassword = @hashedPassword 
      WHERE CUSTOMER_NUMBER = @customerNumber
    `;

    await pool
      .request()
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .input("customerNumber", sql.VarChar, customerNumber)
      .query(updateQuery);

    res.status(200).json({ message: "Sign-up successful. You can now log in." });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "An error occurred during sign-up.", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { customerNumber, password } = req.body;

  if (!customerNumber || !password) {
    return res.status(400).json({ message: "Customer number and password are required." });
  }

  try {
    console.log("Connecting to database...");
    const pool = await sql.connect();

    console.log("Fetching user for customer number:", customerNumber);

    // Fetch user based on customer number
    const result = await pool
      .request()
      .input("customerNumber", sql.VarChar, customerNumber)
      .query(`
        SELECT CUSTOMER_NUMBER, AppPassword, FIRST_NAME, LAST_NAME, EMAILADDRESS 
        FROM Customer 
        WHERE CUSTOMER_NUMBER = @customerNumber
      `);

    console.log("Query Result:", result.recordset);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const user = result.recordset[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.AppPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate JWT including CUSTOMER_NUMBER
    const token = jwt.sign(
      {
        CUSTOMER_NUMBER: user.CUSTOMER_NUMBER,
        firstName: user.FIRST_NAME,
        lastName: user.LAST_NAME,
        email: user.EMAILADDRESS,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "An error occurred during login.", error: error.message });
  }
};