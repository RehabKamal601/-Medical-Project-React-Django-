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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
    fullName: "",
    email: "",
    phone: "",
    specialtyId: "",
    bio: "",
    image: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);
  const validateImageUrl = (url) => /\.(jpeg|jpg|gif|png|svg)$/i.test(url);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.specialtyId) newErrors.specialtyId = "Specialty is required";
    if (!form.bio.trim()) newErrors.bio = "Bio is required";
    if (!validateImageUrl(form.image)) newErrors.image = "Invalid image URL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchDoctors = async () => {
    try {
      const [doctorsRes, specialtiesRes] = await Promise.all([
        fetch("http://localhost:5000/doctors"),
        fetch("http://localhost:5000/specialties"),
      ]);
      setDoctors(await doctorsRes.json());
      setSpecialties(await specialtiesRes.json());
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
      fullName: "",
      email: "",
      phone: "",
      specialtyId: "",
      bio: "",
      image: "",
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
      specialtyId: doctor.specialtyId,
      bio: doctor.bio,
      image: doctor.image,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const url = editingDoctor
        ? `http://localhost:5000/doctors/${editingDoctor.id}`
        : "http://localhost:5000/doctors";
      const method = editingDoctor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save doctor");

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
        message: "Failed to save doctor",
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
      const response = await fetch(
        `http://localhost:5000/doctors/${doctorToDelete.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Delete failed");

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
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Specialty</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.fullName}</TableCell>
                <TableCell>
                  {specialties.find((s) => s.id === doctor.specialtyId)?.name ||
                    "N/A"}
                </TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingDoctor ? "Edit Doctor" : "Add Doctor"}
        </DialogTitle>
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
            rows={3}
            margin="normal"
          />
          <TextField
            label="Image URL *"
            name="image"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            error={!!errors.image}
            helperText={errors.image || "Must be valid image URL"}
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
          Are you sure you want to delete {doctorToDelete?.fullName}?
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
