// import React, { useState } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Chip,
//   Stack,
// } from '@mui/material';
// import { DatePicker, TimePicker } from '@mui/x-date-pickers'; // install @mui/x-date-pickers
// import dayjs from 'dayjs';

// export default function Dashboard() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [availability, setAvailability] = useState([]);
//   const [generatedLink, setGeneratedLink] = useState('');

//   const handleSaveAvailability = () => {
//     if (!selectedDate || !startTime || !endTime) {
//       alert('Please select date, start time, and end time');
//       return;
//     }

//     if (dayjs(startTime).isAfter(dayjs(endTime))) {
//       alert('Start time must be before end time');
//       return;
//     }

//     // Save slot offline
//     const newSlot = {
//       date: dayjs(selectedDate).format('YYYY-MM-DD'),
//       start: dayjs(startTime).format('HH:mm'),
//       end: dayjs(endTime).format('HH:mm'),
//     };

//     setAvailability((prev) => [...prev, newSlot]);

//     // Clear inputs
//     setSelectedDate(null);
//     setStartTime(null);
//     setEndTime(null);
//   };

//   const handleGenerateLink = () => {
//     if (availability.length === 0) {
//       alert('Add at least one availability slot first');
//       return;
//     }

//     // Just simulate generating a link (in real app call backend)
//     const fakeLink = `http://localhost:5173/public/abc123`; // or generate unique id

//     setGeneratedLink(fakeLink);
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Set Your Availability
//       </Typography>

//       <Box display="flex" flexDirection="column" gap={2} mb={3}>
//         <DatePicker
//           label="Select Date"
//           value={selectedDate}
//           onChange={(newValue) => setSelectedDate(newValue)}
//           renderInput={(params) => <TextField {...params} />}
//         />

//         <TimePicker
//           label="Start Time"
//           value={startTime}
//           onChange={(newValue) => setStartTime(newValue)}
//           renderInput={(params) => <TextField {...params} />}
//         />

//         <TimePicker
//           label="End Time"
//           value={endTime}
//           onChange={(newValue) => setEndTime(newValue)}
//           renderInput={(params) => <TextField {...params} />}
//         />

//         <Button variant="contained" onClick={handleSaveAvailability}>
//           Save Availability
//         </Button>
//       </Box>

//       <Typography variant="h6">Saved Availability Slots</Typography>

//       {availability.length === 0 ? (
//         <Typography>No availability slots added yet.</Typography>
//       ) : (
//         <List>
//           {availability.map((slot, index) => (
//             <ListItem key={index} divider>
//               <ListItemText
//                 primary={slot.date}
//                 secondary={`${slot.start} - ${slot.end}`}
//               />
//             </ListItem>
//           ))}
//         </List>
//       )}

//       <Box mt={3}>
//         <Button
//           variant="outlined"
//           disabled={availability.length === 0}
//           onClick={handleGenerateLink}
//         >
//           Generate Booking Link
//         </Button>

//         {generatedLink && (
//           <Box mt={2}>
//             <Typography variant="body1">
//               Your booking link:
//               <a href={generatedLink} target="_blank" rel="noopener noreferrer">
//                 {' '}
//                 {generatedLink}
//               </a>
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// }
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import axios from 'axios';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  // Fetch availability from backend on component mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/availability/${userId}`);
        setAvailability(res.data);
      } catch (err) {
        console.error('Error fetching availability', err);
      }
    };

    if (userId) fetchAvailability();
  }, [userId]);

  const handleSaveAvailability = async () => {
    if (!selectedDate || !startTime || !endTime) {
      alert('Please select date, start time, and end time');
      return;
    }

    if (dayjs(startTime).isAfter(dayjs(endTime))) {
      alert('Start time must be before end time');
      return;
    }

    try {
      const newSlot = {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        start: dayjs(startTime).format('HH:mm'),
        end: dayjs(endTime).format('HH:mm'),
        userId,
      };

      const res = await axios.post('http://localhost:5000/api/availability', newSlot);
      setAvailability((prev) => [...prev, res.data]);

      // Clear inputs
      setSelectedDate(null);
      setStartTime(null);
      setEndTime(null);
    } catch (err) {
      alert('Failed to save availability');
    }
  };

  const handleGenerateLink = async () => {
    if (availability.length === 0) {
      alert('Add at least one availability slot first');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/bookinglink', { userId });
      setGeneratedLink(`http://localhost:5173/public/${res.data.linkId}`);
    } catch (err) {
      alert('Failed to generate booking link');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Set Your Availability
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        <TimePicker
          label="End Time"
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        <Button variant="contained" onClick={handleSaveAvailability}>
          Save Availability
        </Button>
      </Box>

      <Typography variant="h6">Saved Availability Slots</Typography>

      {availability.length === 0 ? (
        <Typography>No availability slots added yet.</Typography>
      ) : (
        <List>
          {availability.map((slot, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={slot.date}
                secondary={`${slot.start} - ${slot.end}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box mt={3}>
        <Button
          variant="outlined"
          disabled={availability.length === 0}
          onClick={handleGenerateLink}
        >
          Generate Booking Link
        </Button>

        {generatedLink && (
          <Box mt={2}>
            <Typography variant="body1">
              Your booking link:{' '}
              <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                {generatedLink}
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
