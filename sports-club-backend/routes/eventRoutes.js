const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// ✅ CREATE new event (admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      createdBy: req.user._id,
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// ✅ UPDATE event (admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, time },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// ✅ DELETE event (admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// ✅ RSVP to Event
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id;

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'Already RSVP’d' });
    }

    event.attendees.push(userId);
    await event.save();

    res.json({ message: 'RSVP successful', attendees: event.attendees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'RSVP failed' });
  }
});

// ❌ Cancel RSVP
router.delete('/:id/rsvp', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id;
    const wasAttending = event.attendees.includes(userId);

    if (!wasAttending) {
      return res.status(400).json({ message: 'You have not RSVP’d to this event' });
    }

    event.attendees = event.attendees.filter(id => id.toString() !== userId.toString());
    await event.save();

    res.json({ message: 'RSVP cancelled', attendees: event.attendees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cancel failed' });
  }
});

// ✅ Get all events (with attendee details)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('attendees', 'name email')
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});




module.exports = router;
