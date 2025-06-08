const mongoose = require('mongoose');

const bookingLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  linkId: {
    type: String,
    required: true,
    unique: true, 
  },
});

module.exports = mongoose.model('BookingLink', bookingLinkSchema);
