const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("Authorization header missing or invalid.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return res.status(500).json({ message: "Internal Server Error" });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded); // Debug: Log the decoded token
    req.user = decoded; // Attach decoded user information to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("JWT Verification Error:", error); // Log any token verification errors

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" }); // Specific message for expired tokens
    }

    return res.status(403).json({ message: "Forbidden" }); // Respond with a 403 Forbidden status
  }
};

module.exports = authenticateToken;