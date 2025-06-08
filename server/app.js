const availabilityRoutes = require('./routes/availability');
app.use('/api/availability', availabilityRoutes);

const bookingLinkRoutes = require('./routes/bookingLink');
app.use('/api/booking-link', bookingLinkRoutes);
