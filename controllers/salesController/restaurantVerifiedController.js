const RestaurantVerified = require('../../models/salesModel/RestaurantVerified');

// Create RestaurantVerified
exports.createRestaurantVerified = async (req, res) => {
  try {
    const verified = new RestaurantVerified(req.body);
    await verified.save();
    res.status(201).json(verified);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all RestaurantVerified
exports.getAllRestaurantVerified = async (req, res) => {
  try {
    const verified = await RestaurantVerified.find().populate('salesPersonId');
    res.json(verified);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get RestaurantVerified by ID
exports.getRestaurantVerifiedById = async (req, res) => {
  try {
    const verified = await RestaurantVerified.findById(req.params.id).populate('salesPersonId');
    if (!verified) return res.status(404).json({ error: 'Verified restaurant not found' });
    res.json(verified);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update RestaurantVerified
exports.updateRestaurantVerified = async (req, res) => {
  try {
    const verified = await RestaurantVerified.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!verified) return res.status(404).json({ error: 'Verified restaurant not found' });
    res.json(verified);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete RestaurantVerified
exports.deleteRestaurantVerified = async (req, res) => {
  try {
    const verified = await RestaurantVerified.findByIdAndDelete(req.params.id);
    if (!verified) return res.status(404).json({ error: 'Verified restaurant not found' });
    res.json({ message: 'Verified restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};