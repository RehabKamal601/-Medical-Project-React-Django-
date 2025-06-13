import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const DoctorInfo = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/doctor/one-doctor/${id}`)
      .then((res) => {
        console.log("Doctor info: ", res.data);
        setDoctor(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Doctor ID:", id);
        setError("Failed to fetch doctor details.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box p={3}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box p={3}>
        <Typography color='error'>{error}</Typography>
      </Box>
    );

  return (
    <Box p={3}>
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          src={doctor.image || ""}
          alt={doctor.full_name}
          sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
        />
        <Typography variant='h5' fontWeight={600}>
          {doctor.full_name}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          {doctor.specialization}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          {doctor.bio}
        </Typography>
        <Typography mt={2}>
          <strong>Rating:</strong> {doctor.rating || "N/A"}
        </Typography>
        <Typography>
          <strong>Email:</strong> {doctor.user.email}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {doctor.phone}
        </Typography>
        <Typography>
          <strong>Address:</strong> {doctor.address}
        </Typography>

        {/* Google Map */}
        <Box mt={3}>
          <iframe
            title='Doctor Location'
            width='100%'
            height='300'
            style={{ border: 0 }}
            loading='lazy'
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              doctor.address || ""
            )}&output=embed`}
          ></iframe>
        </Box>

        {/* Reservation Button */}
        <Box mt={3}>
          <Link
            to={`/patient/make-reservation/${id}`}
            style={{ textDecoration: "none" }}
          >
            <Button variant='contained' color='primary'>
              Make Reservation
            </Button>
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export default DoctorInfo;
