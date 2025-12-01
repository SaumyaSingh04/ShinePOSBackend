const mongoose = require('mongoose');

const RestaurantRegistrationSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  gstNumber: String,
  fssaiNumber: String,

  salesPersonId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SalesPerson', 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['pending', 'active', 'subscribed'], 
    default: 'pending' 
  },

  trialStartDate: Date,
  subscriptionDate: Date
}, { timestamps: true });

module.exports = mongoose.model('RestaurantRegistration', RestaurantRegistrationSchema);