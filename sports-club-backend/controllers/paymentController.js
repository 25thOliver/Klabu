const Payment = require('../models/Payment');

exports.getUserPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ paidAt: -1 });
  res.json(payments);
};
