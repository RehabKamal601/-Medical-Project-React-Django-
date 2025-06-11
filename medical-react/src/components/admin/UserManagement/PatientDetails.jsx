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
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { useAuth } from '../../../hooks/useAuth';
import PersonIcon from "@mui/icons-material/Person";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EditIcon from "@mui/icons-material/Edit";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/patients/${id}/`, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Failed to fetch patient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, authToken]);

  if (loading) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;
  if (!patient) return <Typography sx={{ mt: 4 }}>Patient not found</Typography>;

  const fullName = `${patient.user.first_name} ${patient.user.last_name}`;

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 800, mx: "auto", boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                sx={{ 
                  width: 150, 
                  height: 150,
                  bgcolor: "#199A8E",
                  fontSize: 60
                }}
              >
                {patient.user.first_name.charAt(0)}{patient.user.last_name.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom>
                  {fullName}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/patients/${patient.id}/edit`)}
                >
                  Edit
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon /> Personal Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Email" secondary={patient.user.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Phone" secondary={patient.phone || "N/A"} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Address" secondary={patient.address || "N/A"} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Age" secondary={patient.age || "N/A"} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Gender" 
                        secondary={patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'} 
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <MedicalInformationIcon /> Medical Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Blood Type" 
                        secondary={
                          patient.blood_type ? (
                            <Chip 
                              label={patient.blood_type} 
                              color="error" 
                              size="small" 
                            />
                          ) : "N/A"
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Allergies" 
                        secondary={patient.allergies || "None recorded"} 
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              {patient.medical_history && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalHospitalIcon /> Medical History
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {patient.medical_history}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/admin/patients")}>
          Back to Patients
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default PatientDetails;