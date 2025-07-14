const express = require('express');
const router = express.Router();
const {
  createFacility,
  getFacilities,
  bookFacility,
  deleteFacility
} = require('../controllers/facilityController');
const { protect } = require('../middleware/authMiddleware');
const { checkActiveMembership } = require('../middleware/membershipMiddleware');

router.get('/', protect, getFacilities);
router.post('/', protect, createFacility);
router.post('/:id/book', protect, bookFacility);
router.delete('/:id', protect, deleteFacility);
router.post('/facilities/:id/book', protect, checkActiveMembership, bookFacility);

module.exports = router;
