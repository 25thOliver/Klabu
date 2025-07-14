const express = require('express');
const router = express.Router();
const {
  createTeam,
  requestJoinTeam,
  approveJoinRequest,
  leaveTeam,
  getTeams
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

// 📥 GET all teams with populated members + joinRequests
router.get('/', protect, getTeams);

// 🛠️ Admin creates team
router.post('/', protect, createTeam);

// 🤝 Member requests to join
router.post('/:id/request-join', protect, requestJoinTeam);

// ✅ Admin approves member
router.post('/:teamId/approve/:userId', protect, approveJoinRequest);

// 🚪 Member leaves team
router.post('/:id/leave', protect, leaveTeam);

module.exports = router;
