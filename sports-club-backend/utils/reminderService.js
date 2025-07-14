const nodemailer = require('nodemailer');
const Event = require('../models/Event');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminders = async () => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0); 
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1); 
    
    const events = await Event.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfter
      }
    }).populate('attendees', 'email name');
    

  for (const event of events) {
    for (const user of event.attendees) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Reminder: ${event.title} is tomorrow!`,
        text: `Hi ${user.name},\n\nReminder: You have RSVP’d to "${event.title}" happening on ${event.date} at ${event.time}.\n\nThanks,\nYour Club`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reminder sent to ${user.email}`);
    }
  }
};

module.exports = sendReminders;
