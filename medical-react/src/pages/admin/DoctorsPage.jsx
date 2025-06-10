import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";

const DoctorsPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/doctors/${id}`);
        if (!response.ok) {
          throw new Error("Doctor not found");
        }
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h5" color="error">
          Doctor not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5, backgroundColor: "white" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar src={doctor.image} sx={{ width: 100, height: 100 }} />
          <Box>
            <Typography variant="h5">{doctor.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Specialty: {doctor.specialty}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {doctor.rating}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Bio
        </Typography>
        <Typography variant="body1">{doctor.bio}</Typography>

        {doctor.availableDates && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Available Dates
            </Typography>
            <Box display="flex" gap={2}>
              {doctor.availableDates.map((date, index) => (
                <Typography key={index} variant="body1">
                  {date.day} {date.date}
                </Typography>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default DoctorsPage;
