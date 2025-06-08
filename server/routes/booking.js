// routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/booking
// Create a new booking for a booking link with date and time slot
router.post('/', async (req, res) => {
  const { bookingLinkId, date, startTime, endTime } = req.body;

  if (!bookingLinkId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the slot is already booked for this bookingLinkId
    const existingBooking = await Booking.findOne({
      bookingLinkId,
      date,
      startTime,
      endTime,
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // Create new booking
    const newBooking = new Booking({
      bookingLinkId,
      date,
      startTime,
      endTime,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/booking/:bookingLinkId/:date
// Get all bookings for a booking link on a particular date (to hide booked slots)
router.get('/:bookingLinkId/:date', async (req, res) => {
  const { bookingLinkId, date } = req.params;

  try {
    const bookings = await Booking.find({ bookingLinkId, date });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
