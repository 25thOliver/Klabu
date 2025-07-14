const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  method: { type: String, required: true },
  purpose: { type: String },
  reference: { type: String },
  status: { type: String, default: 'completed' },
  paidAt: { type: Date, default: Date.now },
  expiresAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
