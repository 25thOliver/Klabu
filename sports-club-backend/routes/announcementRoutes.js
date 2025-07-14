const User = require('../models/User');
const express = require('express');
const router = require('express').Router();
const Announcement = require('../models/Announcement');
const { announce } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const isAdmin = require('../middleware/isAdmin');


// POST: Create Announcement (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
      const { title, message } = req.body;
      const announcement = await Announcement.create({
        title,
        message,
        createdBy: req.user._id,
      });
      res.status(201).json(announcement);
    } catch (err) {
      res.status(500).json({ message: 'Failed to post announcement' });
    }
  });
  
  // GET: Fetch all Announcements
  router.get('/', protect, async (req, res) => {
    try {
      const announcements = await Announcement.find()
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
      res.json(announcements);
    } catch (err) {
      res.status(500).json({ message: 'Failed to load announcements' });
    }
  });

  // ✅ Mark single announcement as read
  router.post('/:id/read', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) throw new Error('User not found');
  
      const announcementId = req.params.id;
  
      if (!user.readAnnouncements.map(id => id.toString()).includes(announcementId)) {
        user.readAnnouncements.push(announcementId);
        await user.save();
      }
  
      res.json({ message: 'Marked as read' });
    } catch (err) {
      console.error(' Error in mark-as-read route:', err);
      res.status(500).json({ message: 'Failed to mark as read' });
    }
  });
  
  
  
  
  module.exports = router;
