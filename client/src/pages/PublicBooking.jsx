import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Chip, Button, CircularProgress } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

// Mock availability data per booking link
const availabilityData = {
  abc123: [
    { date: '2025-06-10', start: '10:00', end: '12:00' },
    { date: '2025-06-12', start: '14:00', end: '16:00' },
    { date: '2025-06-15', start: '09:00', end: '11:00' },
  ],
  xyz789: [
    { date: '2025-06-11', start: '09:00', end: '11:00' },
    { date: '2025-06-13', start: '15:00', end: '17:30' },
  ],
};

// Utility: generate half-hour slots between start and end time
const generateTimeSlots = (start, end) => {
  const slots = [];
  let current = dayjs(start, 'HH:mm');
  const endTime = dayjs(end, 'HH:mm');

  while (current.isBefore(endTime)) {
    slots.push(current.format('HH:mm'));
    current = current.add(30, 'minute');
  }
  return slots;
};

function PublicBooking() {
  const { bookingId } = useParams();

  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load availability and bookings from localStorage on mount
  useEffect(() => {
    setLoading(true);

    // Simulate fetch delay
    setTimeout(() => {
      if (availabilityData[bookingId]) {
        setAvailability(availabilityData[bookingId]);

        // Load booked slots from localStorage for this bookingId
        const storedBookings = JSON.parse(localStorage.getItem(`bookings_${bookingId}`)) || [];
        setBookedSlots(storedBookings);
      } else {
        setAvailability(null);
      }
      setLoading(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setBookingSuccess(false);
    }, 500);
  }, [bookingId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!availability) {
    return (
      <Typography variant="h5" sx={{ mt: 5, textAlign: 'center' }}>
        404 - Booking link not found.
      </Typography>
    );
  }

  // Extract available dates as strings 'YYYY-MM-DD'
  const availableDates = availability.map((item) => item.date);

  // Disable all dates not in availableDates
  const disableDate = (date) => {
    const formatted = dayjs(date).format('YYYY-MM-DD');
    return !availableDates.includes(formatted) || dayjs(formatted).isBefore(dayjs(), 'day');
  };

  // Get availability entry for selected date
  const selectedDateStr = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
  const dayAvailability = availability.find((item) => item.date === selectedDateStr);

  // Generate available slots excluding booked ones
  let availableSlots = [];
  if (dayAvailability) {
    const allSlots = generateTimeSlots(dayAvailability.start, dayAvailability.end);
    // Booked slots stored as "YYYY-MM-DDTHH:mm"
    availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(`${selectedDateStr}T${slot}`)
    );
  }

  // Handle booking confirmation
  const handleBook = () => {
    if (!selectedDateStr || !selectedTime) return;

    const newBooking = `${selectedDateStr}T${selectedTime}`;
    const updatedBookedSlots = [...bookedSlots, newBooking];
    setBookedSlots(updatedBookedSlots);
    setBookingSuccess(true);
    setSelectedTime(null);

    // Save updated bookings to localStorage
    localStorage.setItem(`bookings_${bookingId}`, JSON.stringify(updatedBookedSlots));
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 5, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Booking Link: <strong>{bookingId}</strong>
      </Typography>

      <DateCalendar
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
          setBookingSuccess(false);
        }}
        shouldDisableDate={disableDate}
      />

      {selectedDate && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Available slots for {dayjs(selectedDate).format('MMMM DD, YYYY')}:
          </Typography>

          {availableSlots.length === 0 && (
            <Typography>No available time slots for this date.</Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {availableSlots.map((time) => (
              <Chip
                key={time}
                label={time}
                color={selectedTime === time ? 'primary' : 'default'}
                clickable
                onClick={() => setSelectedTime(time)}
              />
            ))}
          </Box>

          {selectedTime && (
            <Button variant="contained" sx={{ mt: 3 }} onClick={handleBook}>
              Book {selectedTime}
            </Button>
          )}

          {bookingSuccess && (
            <Typography sx={{ mt: 2, color: 'green' }}>
              Booking confirmed for {dayjs(selectedDate).format('MMMM DD, YYYY')} at {selectedTime}!
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default PublicBooking;
