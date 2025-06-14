import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const doctorsPerPage = 5;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    address: "",
    image: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (form.phone && !validatePhone(form.phone))
      newErrors.phone = "Invalid phone number (10-15 digits)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchDoctors = async () => {
    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [doctorsRes, specialtiesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/doctor/doctors/", { headers }),
        fetch("http://127.0.0.1:8000/api/admin/specialties/", { headers }),
      ]);

      if (doctorsRes.status === 401 || specialtiesRes.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/login");
        return;
      }

      const doctorsData = await doctorsRes.json();
      const specialtiesData = await specialtiesRes.json();

      setDoctors(doctorsData);
      setSpecialties(specialtiesData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setForm({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      specialization: "",
      bio: "",
      address: "",
      image: null,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      first_name: doctor.user.first_name || "",
      last_name: doctor.user.last_name || "",
      full_name: doctor.full_name || "",
      username: doctor.user?.username || "",
      email: doctor.user?.email || "",
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      bio: doctor.bio || "",
      address: doctor.address || "",
      image: doctor.image || null,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const url = editingDoctor
        ? `http://127.0.0.1:8000/api/doctor/doctors/${editingDoctor.id}/`
        : "http://127.0.0.1:8000/api/doctor/doctors/";
      const method = editingDoctor ? "PUT" : "POST";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestData = {
        full_name: form.full_name,
        user: {
          username: form.username,
          email: form.email,
        },
        specialization: form.specialization,
        phone: form.phone,
        bio: form.bio,
        address: form.address,
        image: form.image,
      };

      if (!editingDoctor) {
        requestData.user.password = form.phone || "defaultPassword123";
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save doctor. Please try again."
        );
      }

      fetchDoctors();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editingDoctor
          ? "Doctor updated successfully"
          : "Doctor added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to save doctor",
        severity: "error",
      });
    }
  };

  const handleDelete = (doctor) => {
    setDoctorToDelete(doctor);
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
        `http://127.0.0.1:8000/api/doctor/doctors/${doctorToDelete.id}/`,
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

      fetchDoctors();
      setConfirmOpen(false);
      setSnackbar({
        open: true,
        message: "Doctor deleted successfully",
        severity: "success",
      });
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

  const getSpecialtyName = (specialization) => {
    if (!specialization) return "Without specialization";
    const specialty = specialties.find((s) => s.name === specialization);
    return specialty
      ? specialty.name
      : specialization || "Without specialization";
  };

  return (
    <Box sx={{ backgroundColor: "#F5F8FF", minHeight: "100vh", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "24px" }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: "#199A8E", fontWeight: "bold" }}
        >
          Doctors Management
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add New Doctor
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>Image</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Specialty</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Rating</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Avatar
                    src={doctor.image || "/default-avatar.png"}
                    alt={doctor.full_name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{doctor.full_name}</TableCell>
                <TableCell>{getSpecialtyName(doctor.specialization)}</TableCell>
                <TableCell>{doctor.user?.email}</TableCell>
                <TableCell>{doctor.phone || "Not Set"}</TableCell>
                <TableCell>{doctor.rating || "Not Set"}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenEdit(doctor)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(doctor)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingDoctor ? "Edit Doctor" : "Add Doctor"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar
              src={form.image || "/default-avatar.png"}
              sx={{ width: 100, height: 100 }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="First Name *"
              name="first_name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              error={!!errors.first_name}
              helperText={errors.first_name}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name *"
              name="last_name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              error={!!errors.last_name}
              helperText={errors.last_name}
              fullWidth
              margin="normal"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Username *"
              name="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
              margin="normal"
              disabled={!!editingDoctor}
            />
          </Box>

          <TextField
            label="Email *"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Specialty</InputLabel>
            <Select
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
              label="Specialty"
            >
              <MenuItem value="">Without specialization</MenuItem>
              {specialties.map((spec) => (
                <MenuItem key={spec.id} value={spec.name}>
                  {spec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Bio"
            name="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingDoctor ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {doctorToDelete?.full_name}?
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorsList;
