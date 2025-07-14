const router = require('express').Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/security');

// Public routes with rate limiting
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

// Password reset (mock implementation)
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  console.log(`[Mock] Password reset for ${email}`);
  res.json({ message: 'Reset link sent (mock)' });
});

module.exports = router;
