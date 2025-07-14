const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const announce = async (req, res) => {
  const { subject, text } = req.body;
  const users = await User.find({ status: 'active' });

  const promises = users.map(user =>
    sendEmail(user.email, subject, text)
      .then(() => console.log(`📨 Email sent to ${user.email}`))
      .catch(() => console.log(`⚠️ Failed for ${user.email}`))
  );

  await Promise.all(promises);
  res.json({ message: 'Announcement sent' });
};

module.exports = { announce };
