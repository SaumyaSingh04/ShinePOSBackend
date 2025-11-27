const mongoose = require('mongoose');

const RestaurantOrderSchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: false
  },
  tableNo: {
    type: String,
    required: true
  },
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    itemName: { type: String }, 
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    isFree: { type: Boolean, default: false },
    nocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NOC'
    }
  }],
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'reserved', 'running', 'served', 'paid', 'completed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  couponCode: String,
  isMembership: {
    type: Boolean,
    default: false
  },
  isLoyalty: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String
  },
  transferHistory: [{
    fromTable: String,
    toTable: String,
    reason: String,
    transferredBy: {
      type: String
    },
    transferredAt: {
      type: Date,
      default: Date.now
    }
  }],
  transactionHistory: [{
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    transactionId: String,
    processedBy: {
      type: String
    },
    processedAt: {
      type: Date,
      default: Date.now
    },
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.models.RestaurantOrder || mongoose.model('RestaurantOrder', RestaurantOrderSchema);