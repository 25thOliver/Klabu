const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  registrationFeePaid: { type: Boolean, default: false },
  dob: { type: String },
  gender: { type: String },
  phone: { type: String },
  address: { type: String },
  emergencyContact: { type: String },
  sport: { type: String },
  membershipStatus: { type: String, enum: ['active', 'expired'], default: 'expired'},
  membershipExpiresAt: { type: Date },
  membershipStartedAt: { type: Date },
  lastMembershipPayment: { type: Date },
  readAnnouncements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement'
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
