const Customer = require("../models/Customer");

// Controller to get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error while fetching customers." });
  }
};

// Export the controller
module.exports = {
  getCustomers,
};
