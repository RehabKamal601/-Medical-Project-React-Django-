import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center", gap: 5 }}>
        <Button
          component={Link}
          to="/admin/doctors"
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 2 }}
        >
          View Doctors
        </Button>
        <Button
          component={Link}
          to="/admin/patients"
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 2 }}
        >
          View Patients
        </Button>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
