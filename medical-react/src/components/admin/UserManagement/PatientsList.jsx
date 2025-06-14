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
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const patientsPerPage = 5;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    blood_type: "",
    allergies: "",
    medical_history: "",
    profile_image: null,
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
    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPatients = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://127.0.0.1:8000/api/patients/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/login");
        return;
      }

      const data = await response.json();
      let patientsArray = [];
      if (Array.isArray(data)) {
        patientsArray = data;
      } else if (Array.isArray(data.results)) {
        patientsArray = data.results;
      } else if (Array.isArray(data.data)) {
        patientsArray = data.data;
      } else {
        patientsArray = [];
      }
      setPatients(patientsArray);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load patients",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setForm({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      age: "",
      gender: "",
      blood_type: "",
      allergies: "",
      medical_history: "",
      profile_image: null,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      first_name: patient.user.first_name || "",
      last_name: patient.user.last_name || "",
      email: patient.email,
      phone: patient.phone || "",
      address: patient.address || "",
      age: patient.age || "",
      gender: patient.gender || "",
      blood_type: patient.blood_type || "",
      allergies: patient.allergies || "",
      medical_history: patient.medical_history || "",
      profile_image: patient.profile_image || null,
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
        setForm({ ...form, profile_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const url = editingPatient
        ? `http://127.0.0.1:8000/api/patients/${editingPatient.id}/`
        : "http://127.0.0.1:8000/api/patients/";
      const method = editingPatient ? "PUT" : "POST";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const patientData = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        age: form.age,
        gender: form.gender,
        blood_type: form.blood_type,
        allergies: form.allergies,
        medical_history: form.medical_history,
        profile_image: form.profile_image,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expired. Please login again.",
            severity: "error",
          });
          navigate("/admin/login");
          return;
        }

        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {}

        if (typeof errorData === "object" && errorData !== null) {
          const fieldErrors = {};
          let errorMessages = [];
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              fieldErrors[key] = errorData[key][0];
              errorMessages.push(`${key}: ${errorData[key][0]}`);
            } else if (typeof errorData[key] === "string") {
              fieldErrors[key] = errorData[key];
              errorMessages.push(`${key}: ${errorData[key]}`);
            }
          }
          setErrors(fieldErrors);
          setSnackbar({
            open: true,
            message:
              errorMessages.length > 0
                ? errorMessages.join(" | ")
                : "Failed to save patient",
            severity: "error",
          });
          return;
        }
        throw new Error(errorData.message || "Failed to save patient");
      }

      fetchPatients();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editingPatient
          ? "Patient updated successfully"
          : "Patient added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to save patient",
        severity: "error",
      });
    }
  };

  const handleDelete = (patient) => {
    setPatientToDelete(patient);
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
        `http://127.0.0.1:8000/api/patients/${patientToDelete.id}/`,
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
          navigate("/admin/login");
          return;
        }
        throw new Error("Delete failed");
      }

      fetchPatients();
      setConfirmOpen(false);
      setSnackbar({
        open: true,
        message: "Patient deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete patient",
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
          Patients Management
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add New Patient
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>Image</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Age</TableCell>
              <TableCell sx={{ color: "#fff" }}>Gender</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Avatar
                    src={patient.profile_image || "/default-avatar.png"}
                    alt={patient.full_name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell>{patient.full_name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone || "Not Set"}</TableCell>
                <TableCell>{patient.age || "Not Set"}</TableCell>
                <TableCell>
                  {patient.gender === "M"
                    ? "Male"
                    : patient.gender === "F"
                    ? "Female"
                      : "Not Set"
                  }
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/admin/patients/${patient.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenEdit(patient)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(patient)}>
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
          {editingPatient ? "Edit Patient" : "Add Patient"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar
              src={form.profile_image || "/default-avatar.png"}
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
              disabled={!!editingPatient}
            />
          </Box>

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

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: 120 }}
            />
          </Box>

          <TextField
            label="Address *"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address || "Full address"}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            label="Allergies"
            name="allergies"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            label="Medical History"
            name="medical_history"
            value={form.medical_history}
            onChange={(e) =>
              setForm({ ...form, medical_history: e.target.value })
            }
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingPatient ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          {patientToDelete?.full_name || "this patient"}?
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

export default PatientList;
