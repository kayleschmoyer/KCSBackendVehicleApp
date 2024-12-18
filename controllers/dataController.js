const { poolPromise } = require("../config/dbConfig");

// Fetch Invoice Data
exports.getInvoiceData = async (req, res) => {
  const { customerId } = req.query;

  try {
    if (!customerId) {
      return res.status(400).json({ success: false, message: "Customer ID is required." });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("customerId", customerId)
      .query(`
        SELECT h.*, l.*
        FROM HistHdr h
        INNER JOIN HistLine l ON h.InvoiceID = l.InvoiceID
        WHERE h.CustomerID = @customerId
      `);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Fetch Vehicles for Customer
exports.getVehicles = async (req, res) => {
  const customerNumber = req.user.CUSTOMER_NUMBER; // Extracted from JWT token payload

  if (!customerNumber) {
    console.error("Customer number missing in token payload.");
    return res
      .status(400)
      .json({ success: false, message: "Customer number is missing in token payload." });
  }

  try {
    const pool = await poolPromise;

    console.log("Fetching vehicles for Customer Number:", customerNumber);

    // Query to fetch car details for a specific CUSTOMER_NUMBER
    const result = await pool
      .request()
      .input("CustomerNumber", customerNumber) // Proper input binding
      .query(`
        SELECT 
          CAR.CAR_YEAR AS year,
          CAR.MAKE AS make,
          CAR.MODEL AS model,
          CAR.VIN_NUMBER AS vin,
          CAR.CAR_COLOR AS color
        FROM 
          CAR
        INNER JOIN 
          CUSTOMER 
        ON 
          CAR.CUSTOMER_NUMBER = CUSTOMER.CUSTOMER_NUMBER
        WHERE 
          CUSTOMER.CUSTOMER_NUMBER = @CustomerNumber
      `);

    // Log the fetched data
    console.log("Query Result:", result.recordset);

    // Return fetched data
    if (result.recordset.length === 0) {
      return res.status(200).json({ success: true, message: "No vehicles found.", data: [] });
    }

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error("Error fetching vehicles:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Fetch Customer Profile (Optional Example for Expansion)
exports.getCustomerProfile = async (req, res) => {
  const customerNumber = req.user.CUSTOMER_NUMBER;

  if (!customerNumber) {
    console.error("Customer number missing in token payload.");
    return res
      .status(400)
      .json({ success: false, message: "Customer number is missing in token payload." });
  }

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("CustomerNumber", customerNumber)
      .query(`
        SELECT 
          FIRST_NAME, 
          LAST_NAME, 
          EMAILADDRESS AS email, 
          PHONE_NUMBER AS phone
        FROM 
          CUSTOMER
        WHERE 
          CUSTOMER_NUMBER = @CustomerNumber
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Customer profile not found." });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error("Error fetching customer profile:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};