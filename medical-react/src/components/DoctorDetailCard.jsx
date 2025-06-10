import React from "react";
import { Box, Button, Typography, Avatar, Rating } from "@mui/material";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const DoctorDetailCard = ({
  doctor,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  onBook,
}) => {
  return (
    <Box p={2}>
      <Box display='flex' alignItems='center' gap={2}>
        <Avatar src={doctor.image} sx={{ width: 64, height: 64 }} />
        <Box>
          <Typography variant='h6'>{doctor.name}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {doctor.specialty}
          </Typography>
          <Box display='flex' alignItems='center' gap={1}>
            <Rating value={doctor.rating} readOnly precision={0.1} />
            <Typography variant='body2'>{doctor.rating}</Typography>
            <Typography variant='body2' color='textSecondary'>
              {doctor.distance}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box my={2}>
        <Typography variant='subtitle1'>About</Typography>
        <Typography variant='body2' color='textSecondary'>
          {doctor.about}
        </Typography>
      </Box>

      {/* Date Buttons */}
      <Box display='flex' gap={1} overflow='auto'>
        {doctor?.availableDates?.map((d, idx) => (
          <Button
            key={idx}
            variant={selectedDate === d.date ? "contained" : "outlined"}
            onClick={() => onDateChange(d.date)}
          >
            <div>
              <div>{d.day}</div>
              <div>{d.date}</div>
            </div>
          </Button>
        ))}
      </Box>

      {/* Time Slots */}
      <Box display='flex' flexWrap='wrap' gap={1} my={2}>
        {timeSlots.map((slot) => (
          <Button
            key={slot}
            variant={selectedTime === slot ? "contained" : "outlined"}
            onClick={() => onTimeChange(slot)}
          >
            {slot}
          </Button>
        ))}
      </Box>

      <Button fullWidth variant='contained' color='primary' onClick={onBook}>
        Book Appointment
      </Button>
    </Box>
  );
};

export default DoctorDetailCard;
