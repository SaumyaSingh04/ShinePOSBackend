const RestaurantRegistration = require('../../models/salesModel/RestaurantRegistration');
const RestaurantVerified = require('../../models/supportModel/RestaurantVerified');

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

// 4. Support - Get Pending Registrations
exports.getPendingRegistrations = async (req, res) => {
  try {
    const registrations = await RestaurantRegistration.find({
      status: { $in: ['submitted'] }
    })
    .populate('salesPersonId', 'name email')
    .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Support - Verify Registration
exports.verifyRegistration = async (req, res) => {
  try {
    const { verificationNotes, action } = req.body; // action: 'verify' or 'reject'
    const registration = await RestaurantRegistration.findById(req.params.id);
    
    if (!registration) return res.status(404).json({ error: 'Registration not found' });

    if (action === 'verify') {
      // Update original registration
      registration.status = 'verified';
      await registration.save();

      // Create verified record
      const verifiedRestaurant = new RestaurantVerified({
        restaurantRegId: registration._id,
        restaurantName: registration.restaurantName,
        ownerName: registration.ownerName,
        phone: registration.phone,
        email: registration.email,
        address: registration.address,
        gstNumber: registration.gstNumber,
        fssaiNumber: registration.fssaiNumber,
        salesPersonId: registration.salesPersonId,
        status: 'verified',
        verifiedBy: req.user?.id || 'support',
        verificationNotes
      });
      
      await verifiedRestaurant.save();
      res.json({ registration, verifiedRestaurant });
    } else {
      registration.status = 'rejected';
      await registration.save();
      res.json(registration);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Admin - Get Verified Restaurants
exports.getVerifiedRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantVerified.find({
      status: { $in: ['verified', 'approved'] }
    })
    .populate('salesPersonId', 'name email')
    .sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Admin - Approve & Activate Restaurant
exports.approveRestaurant = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const restaurant = await RestaurantVerified.findById(req.params.id);
    
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    if (action === 'approve') {
      restaurant.status = 'approved';
      restaurant.approvedAt = new Date();
      restaurant.isSubscribed = true;
      restaurant.activatedAt = new Date();
      restaurant.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    } else {
      restaurant.status = 'rejected';
      restaurant.rejectedAt = new Date();
    }
    
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 8. Admin - Activate Restaurant
exports.activateRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantVerified.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',
        activatedAt: new Date(),
        isSubscribed: true
      },
      { new: true }
    );
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 9. Get All Registrations (Admin)
exports.getAllRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const registrations = await RestaurantRegistration.find(filter)
      .populate('salesPersonId', 'name email')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 10. Get Registration Details
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await RestaurantRegistration.findById(req.params.id)
      .populate('salesPersonId', 'name email phone');
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};