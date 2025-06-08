// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const availabilityRoutes = require('./routes/availability.js');
const bookingRoutes = require('./routes/booking.js');
const bookingLink = require('./routes/bookingLink.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes (attach after DB connection to be safe)
app.use('/api/bookinglink', bookingLink); // Booking link generation & access
app.use('/api', authRoutes);             // /api/register, /api/login
app.use('/api/availability', availabilityRoutes); // Availability CRUD
app.use('/api/booking', bookingRoutes);  // Booking related routes

// Catch all route for undefined paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and then start server
mongoose.connect('mongodb://localhost:27017/scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});