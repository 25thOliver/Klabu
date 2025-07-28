const router = require('express').Router();
const { getAllUsers, getMe, toggleStatus, getPendingApplicants, approveApplicant } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const User = require('../models/User');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/me', protect, getMe);
router.get('/pending', protect, authorize('admin'), getPendingApplicants);
router.post('/:id/approve', protect, authorize('admin'), approveApplicant);
router.patch('/:id/status', protect, authorize('admin'), toggleStatus);
router.get('/:id', protect, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('readAnnouncements');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

module.exports = router;
