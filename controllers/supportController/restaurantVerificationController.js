const RestaurantRegistration = require('../../models/salesModel/RestaurantRegistration');
const RestaurantVerified = require('../../models/salesModel/RestaurantVerified');

// Verify Restaurant (submitted → verified)
exports.verifyRestaurant = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    
    if (registration.status !== 'submitted') {
      return res.status(400).json({ error: 'Registration must be submitted first' });
    }

    // Copy to RestaurantVerified
    const verifiedData = {
      restaurantRegId: registration._id,
      restaurantName: registration.restaurantName,
      ownerName: registration.ownerName,
      phone: registration.phone,
      email: registration.email,
      address: registration.address,
      gstNumber: registration.gstNumber,
      fssaiNumber: registration.fssaiNumber,
      salesPersonId: registration.salesPersonId,
      verifiedBy: req.body.verifiedBy,
      verificationNotes: req.body.verificationNotes
    };

    const verified = new RestaurantVerified(verifiedData);
    await verified.save();

    // Update original registration status
    registration.status = 'verified';
    await registration.save();

    res.json(verified);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Approve Restaurant (verified → approved)
exports.approveRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantVerified.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Verified restaurant not found' });
    
    if (restaurant.status !== 'verified') {
      return res.status(400).json({ error: 'Restaurant must be verified first' });
    }

    restaurant.status = 'approved';
    restaurant.approvedAt = new Date();
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reject Restaurant (verified → rejected)
exports.rejectRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantVerified.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Verified restaurant not found' });
    
    if (restaurant.status !== 'verified') {
      return res.status(400).json({ error: 'Restaurant must be verified first' });
    }

    restaurant.status = 'rejected';
    restaurant.rejectedAt = new Date();
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all verified restaurants
exports.getAllVerifiedRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantVerified.find().populate('salesPersonId');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};