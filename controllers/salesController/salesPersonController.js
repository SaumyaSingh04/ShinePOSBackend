const SalesPerson = require('../../models/salesModel/SalesPerson');

// Create SalesPerson
exports.createSalesPerson = async (req, res) => {
  try {
    const salesPerson = new SalesPerson(req.body);
    await salesPerson.save();
    res.status(201).json(salesPerson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all SalesPersons
exports.getAllSalesPersons = async (req, res) => {
  try {
    const salesPersons = await SalesPerson.find();
    res.json(salesPersons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SalesPerson by ID
exports.getSalesPersonById = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.findById(req.params.id);
    if (!salesPerson) return res.status(404).json({ error: 'SalesPerson not found' });
    res.json(salesPerson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update SalesPerson
exports.updateSalesPerson = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!salesPerson) return res.status(404).json({ error: 'SalesPerson not found' });
    res.json(salesPerson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete SalesPerson
exports.deleteSalesPerson = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.findByIdAndDelete(req.params.id);
    if (!salesPerson) return res.status(404).json({ error: 'SalesPerson not found' });
    res.json({ message: 'SalesPerson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};