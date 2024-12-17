const bcrypt = require("bcrypt");
const sql = require("mssql");
const jwt = require("jsonwebtoken");

// Signup User
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const pool = await sql.connect();

    // Check if user exists and AppPassword is already set
    const checkQuery = `
      SELECT AppPassword 
      FROM Customer 
      WHERE LOWER(FIRST_NAME) = LOWER(@firstName) 
        AND LOWER(LAST_NAME) = LOWER(@lastName) 
        AND LOWER(EMAILADDRESS) = LOWER(@email)
    `;

    const result = await pool
      .request()
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .query(checkQuery);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message:
          "You are not in our system. Please contact the store to be added.",
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
      WHERE LOWER(FIRST_NAME) = LOWER(@firstName) 
        AND LOWER(LAST_NAME) = LOWER(@lastName) 
        AND LOWER(EMAILADDRESS) = LOWER(@email)
    `;

    await pool
      .request()
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .query(updateQuery);

    res.status(200).json({ message: "Sign-up successful. You can now log in." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "An error occurred during sign-up." });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const pool = await sql.connect();

    // Fetch user based on email
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT AppPassword, FIRST_NAME, LAST_NAME FROM Customer WHERE EMAILADDRESS = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    const user = result.recordset[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.AppPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { email: email, firstName: user.FIRST_NAME, lastName: user.LAST_NAME },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
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