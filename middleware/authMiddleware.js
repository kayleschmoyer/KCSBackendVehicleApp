const jwt = require("jsonwebtoken");

// Middleware to verify token and extract CUSTOMER_NUMBER
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || ASDFOEbnirid, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
    }

    req.user = user; // Attach decoded user data to req.user
    next();
  });
};

module.exports = authenticateToken;
