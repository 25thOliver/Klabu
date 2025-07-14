const User = require('../models/User');

const checkExpiredMemberships = async () => {
  const now = new Date();
  await User.updateMany(
    { membershipExpiresAt: { $lt: now } },
    { membershipStatus: 'expired' }
  );
};
