const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const toggleStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });

  user.status = user.status === 'active' ? 'inactive' : 'active';
  await user.save();
  res.json({ status: user.status });
};

// List all users with status 'pending' (applicants)
const getPendingApplicants = async (req, res) => {
  const applicants = await User.find({ status: 'pending' }).select('-passwordHash');
  res.json(applicants);
};

// Approve a pending user (set status to 'active', registrationFeePaid: true, role to 'member')
const approveApplicant = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.status !== 'pending') return res.status(400).json({ message: 'User is not pending approval' });

  user.status = 'active';
  user.registrationFeePaid = true;
  if (user.role !== 'admin') user.role = 'member';
  await user.save();
  res.json({ message: 'User approved', user: { id: user._id, email: user.email, status: user.status, role: user.role } });
};

// Admin: Update a user's details
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Only allow updating certain fields
  const fields = [
    'name', 'email', 'dob', 'gender', 'phone', 'address', 'emergencyContact', 'sport',
    'status', 'role', 'registrationFeePaid', 'membershipStatus'
  ];
  fields.forEach(field => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });
  await user.save();
  res.json({ message: 'User updated', user });
};

// Admin: Delete a user
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

module.exports = { getAllUsers, getMe, toggleStatus, getPendingApplicants, approveApplicant, updateUser, deleteUser };
