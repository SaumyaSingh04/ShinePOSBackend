const RestaurantRegistration = require('../../models/salesModel/RestaurantRegistration');

exports.createRestaurantRegistration = async (req, res) => {
  try {
    const registration = new RestaurantRegistration(req.body);
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRestaurantRegistrations = async (req, res) => {
  try {
    const registrations = await RestaurantRegistration.find().populate('salesPersonId');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantRegistrationById = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findById(req.params.id).populate('salesPersonId');
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await RestaurantRegistration.find({ salesPersonId: req.params.salesPersonId });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRestaurantRegistration = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      req.body,
      { new: true }
    );
    if (!registration) return res.status(404).json({ error: 'Registration not found or not pending' });
    res.json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRestaurantRegistration = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findOneAndDelete({ _id: req.params.id, status: 'pending' });
    if (!registration) return res.status(404).json({ error: 'Registration not found or not pending' });
    res.json({ message: 'Registration deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};