const Availability = require('../models/Availability'); // availability model
const Booking = require('../models/Booking'); // booking model for filtering booked slots
const router = require('./auth');

// GET /api/booking-link/:linkId/availability
router.get('/:linkId/availability', async (req, res) => {
  const { linkId } = req.params;

  try {
    // Find booking link record
    const bookingLink = await BookingLink.findOne({ linkId });
    if (!bookingLink) return res.status(404).json({ message: 'Booking link not found' });

    // Get all availability slots for the user
    const availability = await Availability.find({ userId: bookingLink.userId });

    // Also get booked slots on this booking link, so we can filter them later on frontend
    const bookings = await Booking.find({ bookingLinkId: bookingLink._id });

    res.json({ availability, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/booking-link/:linkId/book
router.post('/:linkId/book', async (req, res) => {
  const { linkId } = req.params;
  const { date, startTime, endTime } = req.body;

  try {
    const bookingLink = await BookingLink.findOne({ linkId });
    if (!bookingLink) return res.status(404).json({ message: 'Booking link not found' });

    // Check if slot already booked for this link
    const existingBooking = await Booking.findOne({
      bookingLinkId: bookingLink._id,
      date,
      startTime,
      endTime,
    });
    if (existingBooking) return res.status(400).json({ message: 'Time slot already booked' });

    // Create new booking
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
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
