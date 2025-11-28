const RestaurantRegistration = require('../../models/salesModel/RestaurantRegistration');

// Create RestaurantRegistration
exports.createRestaurantRegistration = async (req, res) => {
  try {
    const registration = new RestaurantRegistration(req.body);
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all RestaurantRegistrations
exports.getAllRestaurantRegistrations = async (req, res) => {
  try {
    const registrations = await RestaurantRegistration.find().populate('salesPersonId');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get RestaurantRegistration by ID
exports.getRestaurantRegistrationById = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findById(req.params.id).populate('salesPersonId');
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update RestaurantRegistration (only when status = pending)
exports.updateRestaurantRegistration = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    
    if (registration.status !== 'pending') {
      return res.status(403).json({ error: 'Cannot edit registration after submission' });
    }
    
    delete req.body.status; // Prevent manual status changes
    const updated = await RestaurantRegistration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Submit RestaurantRegistration
exports.submitRestaurantRegistration = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    
    if (registration.status !== 'pending') {
      return res.status(400).json({ error: 'Registration already submitted' });
    }
    
    registration.status = 'submitted';
    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get registrations by sales person
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await RestaurantRegistration.find({ 
      salesPersonId: req.params.salesPersonId 
    }).populate('salesPersonId');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete RestaurantRegistration
exports.deleteRestaurantRegistration = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findByIdAndDelete(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};