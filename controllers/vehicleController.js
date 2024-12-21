const { Car } = require("../models");

// Fetch vehicles by CUSTOMER_NUMBER
const fetchCustomerCars = async (req, res) => {
  try {
    const { CUSTOMER_NUMBER } = req.user; // Assuming JWT adds `user` to the request

    if (!CUSTOMER_NUMBER) {
      return res.status(400).json({ message: "Invalid customer information." });
    }

    // Find cars associated with the logged-in user
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

module.exports = { fetchCustomerCars };