const { Car, HistHdr, HistLine, Class } = require("../models"); // Import models
const { sequelize, Op } = require("sequelize"); // Import Sequelize operators

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
    console.error("Error fetching customer cars:", error);
    res.status(500).json({ message: "Failed to fetch customer cars." });
  }
};

const fetchVehicleHistory = async (req, res) => {
  try {
    const { vin } = req.query;
    const { CUSTOMER_NUMBER } = req.user;

    if (!vin || !CUSTOMER_NUMBER) {
      return res.status(400).json({ message: "Invalid request. VIN or customer information is missing." });
    }

    // Fetch invoices for the VIN
    const invoices = await HistHdr.findAll({
      where: {
        CUSTOMER_NUMBER,
        VIN_NUMBER: vin,
      },
      attributes: ["INVOICE_NUMBER", "TOTAL_SALE_AMOUNT", "VIN_NUMBER"],
    });

    if (!invoices.length) {
      return res.status(404).json({ message: "No history found for this vehicle." });
    }

    // Fetch associated classes for each invoice
    const invoiceData = await Promise.all(
      invoices.map(async (invoice) => {
        const classes = await HistLine.findAll({
          where: {
            INVOICE_NUMBER: invoice.INVOICE_NUMBER,
            QUANTITY: { [Op.gt]: 0 }, // QUANTITY > 0
            SELL_PRICE: { [Op.gt]: 0 }, // SELL_PRICE > 0
            DECLINED: { [Op.ne]: 1 },  // DECLINED <> 1
          },
          include: [
            {
              model: Class,
              where: {
                [Op.and]: [
                  { DESCRIPTION: { [Op.notLike]: "%Supplies%" } },
                  { DESCRIPTION: { [Op.notLike]: "%Tax%" } },
                  { DESCRIPTION: { [Op.notLike]: "%Coupons%" } },
                  { DESCRIPTION: { [Op.notLike]: "%Discount%" } },
                  { DESCRIPTION: { [Op.notLike]: "%Credits%" } },
                ],
              },
              attributes: ["DESCRIPTION"],
            },
          ],
          attributes: ["INVOICE_NUMBER"], // Correct attributes
        });        

        // Extract unique class descriptions
        const serviceCategories = classes.map((line) => line.Class.DESCRIPTION).filter(Boolean);

        return {
          INVOICE_NUMBER: invoice.INVOICE_NUMBER,
          TOTAL_SALE_AMOUNT: invoice.TOTAL_SALE_AMOUNT,
          VIN_NUMBER: invoice.VIN_NUMBER,
          SERVICE_CATEGORIES: [...new Set(serviceCategories)], // Remove duplicates
        };
      })
    );

    res.status(200).json(invoiceData);
  } catch (error) {
    console.error("Error fetching vehicle history:", error);
    res.status(500).json({ message: "Failed to fetch vehicle history." });
  }
};

module.exports = { fetchCustomerCars, fetchVehicleHistory };