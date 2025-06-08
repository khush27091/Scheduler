const express = require('express');
const router = express.Router();
const BookingLink = require('../models/BookingLink');

// POST /api/bookinglink
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    const linkId = Math.random().toString(36).substring(2, 8); // basic unique ID

    const bookingLink = new BookingLink({
      userId,
      link: linkId,
    });

    const saved = await bookingLink.save();

    res.status(201).json({ link: `http://localhost:5173/public/${linkId}` });
  } catch (err) {
    console.error('Error generating booking link:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
