const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

router.post('/', async (req, res) => {
  try {
    const { userId, date, start, end } = req.body;

    if (!userId || !date || !start || !end) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSlot = new Availability({
      userId, // this must be a valid ObjectId
      date,
      start,
      end,
    });

    const saved = await newSlot.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error in /api/availability:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
