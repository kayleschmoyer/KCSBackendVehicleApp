const { poolPromise } = require("../config/dbConfig");

exports.getInvoiceData = async (req, res) => {
  const { customerId } = req.query;
  try {
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
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};