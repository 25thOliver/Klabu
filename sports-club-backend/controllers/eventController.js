const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const event = await Event.create({ title, description, date, location, createdBy: req.user._id });
  res.status(201).json(event);
};

const getEvents = async (req, res) => {
  const events = await Event.find().populate('attendees', 'name');
  res.json(events);
};

const rsvp = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (!event.attendees.includes(req.user._id)) {
    event.attendees.push(req.user._id);
    await event.save();
  };

  if (req.user.membershipStatus !== 'active') {
    return res.status(403).json({ message: 'Your membership is inactive. Renew to RSVP.' });
  }
  
  res.json({ message: 'RSVP confirmed' });
};

module.exports = { createEvent, getEvents, rsvp };
