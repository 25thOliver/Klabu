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

module.exports = { getAllUsers, getMe, toggleStatus };
