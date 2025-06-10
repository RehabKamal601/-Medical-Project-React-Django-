import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Box,
  Button,
} from "@mui/material";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data))
      .catch((err) => console.error("Failed to fetch doctor:", err));
  }, [id]);

  if (!doctor) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 600, mx: "auto", boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={doctor.image || ""}
                alt={doctor.fullName}
                sx={{ width: 120, height: 120 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {doctor.fullName}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>Specialty:</strong> {doctor.specialty}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {doctor.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {doctor.phone}
                </Typography>
              </Box>
              {doctor.bio && (
                <Typography variant="body2" color="text.secondary">
                  {doctor.bio}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin/doctors")}>
          Back to Doctors
        </Button>
      </Box>
    </Container>
  );
};

export default DoctorDetails;
