exports.checkActiveMembership = (req, res, next) => {
    if (req.user.membershipStatus !== 'active') {
      return res.status(403).json({ message: 'Membership expired. Please renew.' });
    }
    next();
  };
  