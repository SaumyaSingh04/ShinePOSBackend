const RestaurantRegistration = require('../../models/salesModel/RestaurantRegistration');
const RestaurantVerified = require('../../models/supportModel/RestaurantVerified');

exports.verifyRegistration = async (req, res) => {
  try {
    const { verificationNotes, action } = req.body;
    const registration = await RestaurantRegistration.findById(req.params.id);
    
    if (!registration) return res.status(404).json({ error: 'Registration not found' });

    if (action === 'verify') {
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
        verifiedBy: req.user?.id || 'support',
        verificationNotes
      });
      
      await verifiedRestaurant.save();
      registration.status = 'active';
      await registration.save();
      res.json(verifiedRestaurant);
    } else {
      registration.status = 'rejected';
      await registration.save();
      res.json(registration);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.approveRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantVerified.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',
        approvedAt: new Date(),
        isSubscribed: true,
        activatedAt: new Date()
      },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllVerifiedRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantVerified.find().populate('salesPersonId');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingRegistrations = async (req, res) => {
  try {
    const registrations = await RestaurantRegistration.find({ status: 'pending' })
      .populate('salesPersonId')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};