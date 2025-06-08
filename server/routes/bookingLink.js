// routes/bookingLink.js

const express = require('express');
const router = express.Router();

const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const BookingLink = require('../models/BookingLink');

// POST /api/booking-link/generate
router.post('/', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // ✅ Check if user already has a link
    const existingLink = await BookingLink.findOne({ userId });

    if (existingLink) {
      return res.status(200).json({
        message: 'Link already exists',
        linkId: existingLink.linkId,
      });
    }

    // ✅ If not, generate a new unique linkId
    let linkId;
    let exists = true;

    while (exists) {
      linkId = Math.random().toString(36).substring(2, 10);
      exists = await BookingLink.findOne({ linkId });
    }

    const newLink = new BookingLink({
      userId,
      linkId,
    });

    await newLink.save();

    res.status(201).json({
      message: 'New link generated',
      linkId,
    });
  } catch (error) {
    console.error('Error generating booking link:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:linkId/availability', async (req, res) => {
  const { linkId } = req.params;

  try {
    const bookingLink = await BookingLink.findOne({ linkId });
    if (!bookingLink) return res.status(404).json({ message: 'Booking link not found' });

    const availability = await Availability.find({ userId: bookingLink.userId });
    const bookings = await Booking.find({ bookingLinkId: bookingLink._id });

    res.json({ availability, bookings });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:linkId/book', async (req, res) => {
  const { linkId } = req.params;
  const { date, startTime, endTime } = req.body;

  try {
    const bookingLink = await BookingLink.findOne({ linkId });
    if (!bookingLink) return res.status(404).json({ message: 'Booking link not found' });

    const existingBooking = await Booking.findOne({
      bookingLinkId: bookingLink._id,
      date,
      startTime,
      endTime,
    });

    if (existingBooking) return res.status(400).json({ message: 'Time slot already booked' });

    const booking = new Booking({
      bookingLinkId: bookingLink._id,
      userId: bookingLink.userId,
      date,
      startTime,
      endTime,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
