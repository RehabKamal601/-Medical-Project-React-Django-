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

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data))
      .catch((err) => console.error("Failed to fetch patient:", err));
  }, [id]);

  if (!patient) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 600, mx: "auto", boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={patient.image || ""}
                alt={patient.fullName}
                sx={{ width: 120, height: 120 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {patient.fullName}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>Age:</strong> {patient.age}
                </Typography>
                <Typography variant="body1">
                  <strong>Gender:</strong> {patient.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Contact:</strong> {patient.contact}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {patient.email}
                </Typography>
              </Box>
              {patient.notes && (
                <Typography variant="body2" color="text.secondary">
                  Notes: {patient.notes}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button variant="contained" onClick={() => navigate("/admin/patients")}>
                Back to Doctors
              </Button>
            </Box>
    </Container>
  );
};

export default PatientDetails;
