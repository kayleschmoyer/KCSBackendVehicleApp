// controllers/estimateController.js
const { Estimate } = require("../models");

exports.getEstimateData = async (req, res) => {
  const { customerId } = req.query;
  try {
    // Pull only the six columns you need, filtered by customer
    const list = await Estimate.findAll({
      attributes: [
        "estimateNumber",
        "status",
        "carYear",
        "make",
        "model",
        "licNumber",
      ],
      where: { customerNumber: customerId },
    });

    // Sequelize returns JS objects with your aliased fields
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
