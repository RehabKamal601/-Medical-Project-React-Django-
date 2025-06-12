import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  TextField,
  Divider,
  Alert,
  Snackbar,
  Grid,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import PersonIcon from "@mui/icons-material/Person";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const PatientProfile = () => {
  const { authToken, user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        let token = null;
        // Get the token from user or localStorage
        if (authToken) {
          token = authToken;
        } else if (user && user.access) {
          token = user.access;
        } else if (user && user.refresh) {
          token = user.refresh;
        } else if (localStorage.getItem("access")) {
          token = localStorage.getItem("access");
        } else if (localStorage.getItem("token")) {
          token = localStorage.getItem("token");
        }
        if (!token) {
          setSnackbar({
            open: true,
            message: "Please login first.",
            severity: "error",
          });
          setLoading(false);
          return;
        }
        const response = await fetch("http://localhost:8000/api/patients/profile/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expired or not logged in. Please login again.",
            severity: "error",
          });
          setLoading(false);
          return;
        }
        const data = await response.json();
        setPatient(data);
        setFormData({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          phone: data.phone,
          address: data.address,
          age: data.age,
          gender: data.gender,
          blood_type: data.blood_type,
          allergies: data.allergies,
          medical_history: data.medical_history,
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch profile data. Please make sure you are logged in.",
          severity: "error",
        });
        console.error("Failed to fetch patient profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, [authToken, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (formData.age && (formData.age < 1 || formData.age > 120)) newErrors.age = "Age must be between 1-120";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Get the token using the same logic as in useEffect
    let token = null;
    if (authToken) {
      token = authToken;
    } else if (user && user.access) {
      token = user.access;
    } else if (localStorage.getItem("access")) {
      token = localStorage.getItem("access");
    } else if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login first.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/patients/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired or not logged in. Please login again.",
          severity: "error",
        });
        return;
      }

      if (!response.ok) {
        // Do not clear profile data on error
        const errorData = await response.json().catch(() => ({}));
        setSnackbar({
          open: true,
          message: errorData.detail || "Failed to update profile",
          severity: "error",
        });
        return;
      }

      const updatedData = await response.json();
      // تحديث بيانات user بشكل منفصل إذا كان الاسم أو الإيميل ضمن التعديل
      if (patient && patient.user) {
        setPatient({
          ...patient,
          ...updatedData,
          user: {
            ...patient.user,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            ...updatedData.user // لو فيه user جديد من السيرفر
          }
        });
      } else {
        setPatient(updatedData && updatedData.user ? updatedData : { ...patient, ...updatedData });
      }
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  if (loading) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;
  if (!patient || !patient.user) return <Typography sx={{ mt: 4 }}>Profile not found</Typography>;

  const fullName = `${patient.user.first_name || ''} ${patient.user.last_name || ''}`.trim();

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ maxWidth: 800, mx: "auto", boxShadow: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4">My Profile</Typography>
            {editMode ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                sx={{ 
                  width: 150, 
                  height: 150,
                  bgcolor: "#199A8E",
                  fontSize: 60,
                  mb: 2
                }}
              >
                {(patient.user && patient.user.first_name ? patient.user.first_name.charAt(0) : "")}{(patient.user && patient.user.last_name ? patient.user.last_name.charAt(0) : "")}
              </Avatar>
              {editMode ? (
                <>
                  <TextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    fullWidth
                    margin="normal"
                  />
                </>
              ) : (
                <Typography variant="h5" align="center">
                  {fullName}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon /> Personal Information
              </Typography>
              
              {editMode ? (
                <>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    error={!!errors.age}
                    helperText={errors.age}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </TextField>
                </>
              ) : (
                <>
                  <Typography><strong>Email:</strong> {patient.user ? patient.user.email : "N/A"}</Typography>
                  <Typography><strong>Phone:</strong> {patient.phone || "N/A"}</Typography>
                  <Typography><strong>Address:</strong> {patient.address || "N/A"}</Typography>
                  <Typography><strong>Age:</strong> {patient.age || "N/A"}</Typography>
                  <Typography>
                    <strong>Gender:</strong> {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <MedicalInformationIcon /> Medical Information
              </Typography>
              
              {editMode ? (
                <>
                  <TextField
                    label="Blood Type"
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Medical History"
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                  />
                </>
              ) : (
                <>
                  <Typography>
                    <strong>Blood Type:</strong> {patient.blood_type || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Allergies:</strong> {patient.allergies || "None recorded"}
                  </Typography>
                  {patient.medical_history && (
                    <>
                      <Typography><strong>Medical History:</strong></Typography>
                      <Typography sx={{ whiteSpace: "pre-line", mt: 1 }}>
                        {patient.medical_history}
                      </Typography>
                    </>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientProfile;