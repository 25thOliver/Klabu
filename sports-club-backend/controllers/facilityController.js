const Facility = require('../models/Facility');
const Payment = require('../models/Payment');

// Admin: Create Facility
exports.createFacility = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create facilities' });
  }

  const { name, description, price } = req.body;

  const facility = await Facility.create({
    name,
    description,
    price: price || 0, // default if not set
  });

  res.status(201).json(facility);
};

// All: Get Facilities
exports.getFacilities = async (req, res) => {
  const facilities = await Facility.find().populate('bookings.user', 'name email');
  res.json(facilities);
};

// Member: Book Facility
exports.bookFacility = async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  // Inside bookFacility controller
  const user = req.user;

  if (user.membershipStatus !== 'active') {
    return res.status(403).json({ message: 'Membership expired. Please renew.' });
  };


  const facility = await Facility.findById(id);
  if (!facility) return res.status(404).json({ message: 'Facility not found' });

  const conflict = facility.bookings.some(b => b.date === date && b.time === time);
  if (conflict) return res.status(400).json({ message: 'Time slot already booked' });

  facility.bookings.push({ user: req.user._id, date, time });
  await facility.save();

  // 💳 Create payment
  await Payment.create({
    user: req.user._id,
    amount: facility.price,
    method: 'facility-booking',
    currency: 'KES',
    reference: `REF-${Date.now()}`,
    purpose: `Booking for ${facility.name} (${date} @ ${time})`,
    status: 'completed'
  });

  res.json({ message: 'Booking successful' });
};

// Admin: Delete Facility
exports.deleteFacility = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can delete facilities' });

  await Facility.findByIdAndDelete(req.params.id);
  res.json({ message: 'Facility deleted' });
};
