import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";

const ReservationPage = () => {
  const { id } = useParams(); // doctor id
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/doctor/${id}/availability/`)
      .then((res) => {
        console.log("Doctor Availability:", res.data);
        setAvailability(res.data);
      })
      .catch((err) => {
        console.error("Error fetching availability:", err);
        setAvailability([]);
      });
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

    const userData = localStorage.getItem("user_data");
    const accessToken = localStorage.getItem("access_token");

    if (!userData || !accessToken) {
      setError("Patient not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(userData);
    const patientId = parsedUser?.id;

    if (!patientId) {
      setError("Patient ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const datetime = new Date(`${date}T${time}`).toISOString();

      const payload = {
        doctor: parseInt(id),
        patient: patientId,
        date: datetime,
        notes: notes || "",
      };

      console.log("Payload to send:", payload);

      const res = await axios.post(
        "http://localhost:8000/api/doctor/reserve-appointment/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Server response:", res.data);

      setSuccess(true);
      setDate("");
      setTime("");
      setNotes("");
    } catch (err) {
      console.error("Full error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          "Reservation failed. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={600} mx='auto'>
      <Typography variant='h4' fontWeight={600} gutterBottom>
        Book Appointment
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin='normal'
          type='date'
          label='Date'
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          inputProps={{ min: minDate }}
        />

        <FormControl fullWidth margin='normal'>
          <InputLabel id='time-label'>Available Times</InputLabel>
          <Select
            labelId='time-label'
            value={time}
            label='Available Times'
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
          margin='normal'
          label='Notes'
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Box mt={3}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Reserve Appointment"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity='success'
          sx={{ width: "100%" }}
        >
          Reservation successfully made!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity='error'
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReservationPage;
