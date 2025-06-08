// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingLink',
    required: true
  },
  date: {
    type: String, // e.g. "2025-06-09"
    required: true
  },
  time: {
    type: String, // e.g. "10:30 AM"
    required: true
  },
  name: {
    type: String, // Optional: for visitor who booked
  },
  email: {
    type: String, // Optional
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
