import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Chip, Button, CircularProgress } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

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

    fetch(`http://localhost:5000/api/bookinglink/${bookingId}/availability`)
      .then((res) => res.json())
      .then((data) => {
        if (data.availability) {
          const formattedAvailability = data.availability.map((slot) => ({
            date: slot.date,
            start: slot.start,  // ✅ use correct keys
            end: slot.end,
          }));

          const booked = data.bookings.map(
            (b) => `${b.date}T${b.startTime}`
          );

          setAvailability(formattedAvailability);
          setBookedSlots(booked);
        } else {
          setAvailability(null);
        }

        setLoading(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setBookingSuccess(false);
      })
      .catch((err) => {
        console.error('Error loading booking info:', err);
        setAvailability(null);
        setLoading(false);
      });
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

  const availableDates = availability.map((item) => item.date);

  const disableDate = (date) => {
    const formatted = dayjs(date).format('YYYY-MM-DD');
    return !availableDates.includes(formatted) || dayjs(formatted).isBefore(dayjs(), 'day');
  };

  const selectedDateStr = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
  const dayAvailability = availability.find((item) => item.date === selectedDateStr);

  let availableSlots = [];
  if (dayAvailability) {
    const allSlots = generateTimeSlots(dayAvailability.start, dayAvailability.end);
    availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(`${selectedDateStr}T${slot}`)
    );
  }

  const handleBook = () => {
    if (!selectedDateStr || !selectedTime) return;

    const newBooking = `${selectedDateStr}T${selectedTime}`;
    const updatedBookedSlots = [...bookedSlots, newBooking];
    setBookedSlots(updatedBookedSlots);
    setBookingSuccess(true);
    setSelectedTime(null);

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
              Booking confirmed for {dayjs(selectedDate).format('MMMM DD, YYYY')} !
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default PublicBooking;
