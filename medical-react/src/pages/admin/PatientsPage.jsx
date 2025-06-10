import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, CircularProgress, Box, Button } from "@mui/material";
import UserCard from "../../components/admin/UserManagement/UserCard";
import { useNavigate } from "react-router-dom";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/patients");
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Patients
        </Typography>
        <Grid container spacing={4}>
          {patients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <UserCard
                id={patient.id}
                img={patient.image}
                title={patient.fullName}
                desc={`${patient.gender}, ${patient.age} years old`}
                page={`/patients/${patient.id}`}
                fullUser={patient}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin")}
          sx={{ px: 4 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </>
  );
};

export default PatientsPage;
