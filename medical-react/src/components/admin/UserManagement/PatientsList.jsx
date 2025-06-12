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
  Switch,
  FormControlLabel,
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
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
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
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPatients = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/patients/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setPatients(data);
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
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth,
      address: patient.address,
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
      const token = getAuthToken();
      const url = editingPatient
        ? `http://127.0.0.1:8000/api/admin/patients/${editingPatient.id}/`
        : "http://127.0.0.1:8000/api/admin/patients/";
      const method = editingPatient ? "PUT" : "POST";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
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
        throw new Error("Failed to save patient");
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
        message: "Failed to save patient",
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
        `http://127.0.0.1:8000/api/admin/patients/${patientToDelete.id}/`,
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date of Birth</TableCell>
              <TableCell sx={{ color: "#fff" }}>Address</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{formatDate(patient.date_of_birth)}</TableCell>
                <TableCell>{patient.address}</TableCell>
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPatient ? "Edit Patient" : "Add Patient"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name || "At least 3 characters"}
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
            label="Date of Birth *"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
            error={!!errors.date_of_birth}
            helperText={errors.date_of_birth}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Address *"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address || "Full address"}
            fullWidth
            margin="normal"
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
          Are you sure you want to delete {patientToDelete?.name}?
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
