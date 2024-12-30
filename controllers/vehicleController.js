const { Car, HistHdr } = require("../models"); // Import models
const { sequelize } = require("../models"); // Import sequelize instance

const fetchCustomerCars = async (req, res) => {
  try {
    const { CUSTOMER_NUMBER } = req.user;

    if (!CUSTOMER_NUMBER) {
      return res.status(400).json({ message: "Invalid customer information." });
    }

    const cars = await Car.findAll({
      where: { CUSTOMER_NUMBER },
      attributes: ["CAR_YEAR", "MAKE", "MODEL", "VIN_NUMBER", "CAR_COLOR"],
    });

    if (!cars.length) {
      return res.status(404).json({ message: "No vehicles found for this customer." });
    }

    res.status(200).json({ cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Failed to fetch cars." });
  }
};

const fetchVehicleHistory = async (req, res) => {
  try {
    const { vin } = req.query;
    const { CUSTOMER_NUMBER } = req.user;

    console.log("VIN:", vin);
    console.log("Customer Number:", CUSTOMER_NUMBER);

    if (!vin || !CUSTOMER_NUMBER) {
      return res.status(400).json({ message: "Invalid request. VIN or customer information is missing." });
    }

    // Raw SQL Query for Debugging
    const sqlQuery = `
      SELECT * 
      FROM HistHdr
      WHERE CUSTOMER_NUMBER = :customerNumber
      AND VIN_NUMBER = :vin
    `;
    const [results] = await sequelize.query(sqlQuery, {
      replacements: { customerNumber: CUSTOMER_NUMBER, vin: vin },
    });

    if (!results.length) {
      console.warn("No data found using raw SQL query.");
    }

    // Original Sequelize Query
    const history = await HistHdr.findAll({
      where: {
        CUSTOMER_NUMBER,
        VIN_NUMBER: vin,
      },
      attributes: [
        "INVOICE_NUMBER",
        "TOTAL_SALE_AMOUNT",
        "VIN_NUMBER",
      ],
    });

    if (!history.length) {
      return res.status(404).json({ message: "No history found for this vehicle." });
    }

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching vehicle history:", error);
    res.status(500).json({ message: "Failed to fetch vehicle history." });
  }
};

module.exports = { fetchCustomerCars, fetchVehicleHistory };