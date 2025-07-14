const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  time: String,
});

const facilitySchema = new mongoose.Schema({
  name: String,
  description: String,
  price: {
    type: Number,
    required: true,
    default: 0
  },
  bookings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: String,
      time: String,
    }
  ]
});

module.exports = mongoose.model('Facility', facilitySchema);
