import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const mockDoctors = [
  {
    id: "1",
    name: "Dr. Amina Khaled",
    specialty: "Cardiology",
    availability: {
      Monday: ["09:00 AM", "11:00 AM"],
      Tuesday: ["01:00 PM", "03:00 PM"],
      Thursday: ["10:00 AM"],
      Friday: ["02:00 PM", "04:00 PM"],
    },
  },
  {
    id: "2",
    name: "Dr. Omar Tarek",
    specialty: "Dermatology",
    availability: {
      Monday: ["11:00 AM"],
      Tuesday: ["09:00 AM", "12:00 PM"],
      Wednesday: ["03:00 PM"],
      Friday: ["10:00 AM"],
    },
  },
];

// Helper to get next 7 days with day names
const getNext7Days = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push({
      dateObj: d,
      dayName: daysOfWeek[d.getDay()],
      dateString: d.toISOString().split("T")[0], // yyyy-mm-dd
    });
  }
  return dates;
};

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const doctor = mockDoctors.find((d) => d.id === doctorId);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!doctor) {
    return (
      <Box p={3}>
        <Typography variant='h6' color='error'>
          Doctor not found
        </Typography>
      </Box>
    );
  }

  const next7Days = getNext7Days();

  // Filter dates that have availability
  const availableDates = next7Days.filter(
    (day) => doctor.availability[day.dayName]?.length > 0
  );

  // Get available time slots for selected date
  const availableTimes = selectedDate
    ? doctor.availability[
        next7Days.find((d) => d.dateString === selectedDate)?.dayName
      ] || []
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (!selectedTime) {
      setError("Please select a time.");
      return;
    }

    // TODO: Replace with API call to book appointment
    console.log(
      `Booking appointment with doctor ${doctor.name} on ${selectedDate} at ${selectedTime}`
    );

    setSuccess(true);
    setSelectedDate("");
    setSelectedTime("");

    // Optionally redirect after success
    // navigate('/my-appointments');
  };

  return (
    <Box p={3}>
      <Typography variant='h4' gutterBottom>
        Book Appointment with {doctor.name}
      </Typography>
      <Typography variant='subtitle1' gutterBottom color='text.secondary'>
        Specialty: {doctor.specialty}
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin='normal' variant='outlined'>
              <InputLabel id='date-label'>Select Date</InputLabel>
              <Select
                labelId='date-label'
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(""); // reset time when date changes
                  setError("");
                  setSuccess(false);
                }}
                label='Select Date'
              >
                {availableDates.length === 0 ? (
                  <MenuItem disabled>No available dates</MenuItem>
                ) : (
                  availableDates.map((day) => (
                    <MenuItem key={day.dateString} value={day.dateString}>
                      {day.dayName} — {day.dateString}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin='normal'
              variant='outlined'
              disabled={!selectedDate}
            >
              <InputLabel id='time-label'>Select Time</InputLabel>
              <Select
                labelId='time-label'
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setError("");
                  setSuccess(false);
                }}
                label='Select Time'
              >
                {availableTimes.length === 0 ? (
                  <MenuItem disabled>No available time slots</MenuItem>
                ) : (
                  availableTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {error && (
              <Typography color='error' variant='body2' mt={1}>
                {error}
              </Typography>
            )}

            {success && (
              <Alert severity='success' sx={{ mt: 2 }}>
                Appointment successfully booked!
              </Alert>
            )}

            <Box mt={3}>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={!selectedDate || !selectedTime}
              >
                Book Appointment
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentBooking;
