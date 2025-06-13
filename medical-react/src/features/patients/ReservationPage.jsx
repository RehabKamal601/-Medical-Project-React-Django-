import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';

const ReservationPage = () => {
  const { id } = useParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [minDate, setMinDate] = useState('');

  const patientId = localStorage.getItem('patientId'); // Or get from auth context

  useEffect(() => {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/doctors/${id}/availability/`)
      .then((res) => setAvailability(res.data))
      .catch(() => setAvailability([]));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError("You must book at least one day in advance.");
      setLoading(false);
      return;
    }

    try {
      const datetime = `${date}T${time}`;
      await axios.post('http://localhost:8000/api/all-appointments/', {
        doctor: id,
        patient: patientId,
        date: datetime,
        notes
      });
      setSuccess(true);
      setDate('');
      setTime('');
      setNotes('');
    } catch (err) {
      setError('Reservation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Book Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          inputProps={{ min: minDate }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="time-label">Available Times</InputLabel>
          <Select
            labelId="time-label"
            value={time}
            label="Available Times"
            onChange={(e) => setTime(e.target.value)}
            required
          >
            {availability.map((slot) => (
              <MenuItem key={slot.id} value={slot.start_time}>
                {slot.day} - {slot.start_time} to {slot.end_time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Notes"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Reserve Appointment'}
          </Button>
        </Box>
      </form>

      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Reservation successfully made!
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReservationPage;
