const mongoose = require('mongoose');

const RestaurantVerifiedSchema = new mongoose.Schema({
  restaurantRegId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantRegistration",
    required: true
  },
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
    enum: ['verified', 'approved', 'active', 'inactive', 'rejected'], 
    default: 'verified' 
  },

  verifiedBy: { type: String, required: true },
  verificationNotes: String,
  approvedAt: Date,
  rejectedAt: Date,

  isSubscribed: { type: Boolean, default: false },
  monthlyFee: { type: Number, default: 1499 },
  subscriptionStartMonth: String,
  nextBillingDate: Date,
  activatedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('RestaurantVerified', RestaurantVerifiedSchema);