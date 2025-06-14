import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Snackbar,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialtyId: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.specialtyId) newErrors.specialtyId = "Specialty is required";
    if (!form.bio.trim()) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      const [doctorRes, specialtiesRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/doctor/doctors/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch("http://127.0.0.1:8000/api/admin/specialties/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (doctorRes.status === 401 || specialtiesRes.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/login");
        return;
      }

      if (!doctorRes.ok) {
        throw new Error("Failed to fetch doctor details");
      }

      const doctorData = await doctorRes.json();
      const specialtiesData = await specialtiesRes.json();

      setDoctor(doctorData);
      setSpecialties(specialtiesData);
      setForm({
        fullName: doctorData.full_name || "",
        email: doctorData.email || "",
        phone: doctorData.phone || "",
        specialtyId: doctorData.specialty || doctorData.specialty_id || "",
        bio: doctorData.bio || "",
      });
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error fetching doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const handleOpenEdit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const url = `http://127.0.0.1:8000/api/doctor/doctors/${id}/`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestData = {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        specialty: form.specialtyId,
        bio: form.bio,
      };

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expired. Please login again.",
            severity: "error",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to update doctor");
      }

      fetchDoctorDetails();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Doctor updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update doctor",
        severity: "error",
      });
    }
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/doctor/doctors/${id}/`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expired. Please login again.",
            severity: "error",
          });
          navigate("/login");
          return;
        }
        throw new Error("Delete failed");
      }

      setSnackbar({
        open: true,
        message: "Doctor deleted successfully",
        severity: "success",
      });
      navigate("/admin/doctors");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete doctor",
        severity: "error",
      });
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  const getSpecialtyName = (specialtyId) => {
    if (!specialtyId) return "Without specialization";
    const specialty = specialties.find((s) => s.id === specialtyId);
    return specialty ? specialty.name : "Without specialization";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error Loading Doctor Details</Typography>
          <Typography>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Doctor not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5F8FF", minHeight: "100vh", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "24px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#199A8E", fontWeight: "bold" }}
          >
            Doctor Details
          </Typography>
          <Tooltip title="Back to Doctors List">
            <IconButton
              onClick={() => navigate("/admin/doctors")}
              color="primary"
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Card sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid
                item
                xs={12}
                md={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Avatar
                  src={doctor.image || "/default-avatar.png"}
                  alt={doctor.full_name}
                  sx={{ width: 120, height: 120 }}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    {doctor.full_name || "No name provided"}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Doctor">
                      <IconButton
                        onClick={handleOpenEdit}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Doctor">
                      <IconButton onClick={handleDelete} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon /> Personal Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Specialty:</strong>{" "}
                      {getSpecialtyName(
                        doctor.specialty || doctor.specialty_id
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Email:</strong> {doctor.email || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {doctor.phone || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>

                {doctor.bio && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Biography
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                      <Typography variant="body1">{doctor.bio}</Typography>
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Doctor</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name *"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={!!errors.fullName}
            helperText={errors.fullName || "At least 3 characters"}
            fullWidth
            margin="normal"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email *"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email || "e.g., user@example.com"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone *"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone || "10-15 digits only"}
            fullWidth
            margin="normal"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 15,
            }}
          />
          <TextField
            select
            label="Specialty *"
            name="specialtyId"
            value={form.specialtyId}
            onChange={(e) => setForm({ ...form, specialtyId: e.target.value })}
            error={!!errors.specialtyId}
            helperText={errors.specialtyId}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select Specialty</MenuItem>
            {specialties.map((spec) => (
              <MenuItem key={spec.id} value={spec.id}>
                {spec.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Bio *"
            name="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            error={!!errors.bio}
            helperText={errors.bio || "At least 10 characters"}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {doctor.full_name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorDetails;
