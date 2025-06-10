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
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    fullName: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    notes: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);
  const validateAge = (age) => age > 0 && age <= 120;

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!validateAge(form.age)) newErrors.age = "Age must be 1-120";
    if (!form.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/patients");
      setPatients(await response.json());
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load data",
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

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const url = editingPatient
        ? `http://localhost:5000/patients/${editingPatient.id}`
        : "http://localhost:5000/patients";
      const method = editingPatient ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to save");
      fetchPatients();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: `Patient ${editingPatient ? "updated" : "added"} successfully`,
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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/patients/${patientToDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Delete failed");
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
    }
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
          <Button
            variant="contained"
            onClick={() => {
              setEditingPatient(null);
              setForm({
                fullName: "",
                email: "",
                phone: "",
                address: "",
                age: "",
                gender: "",
                notes: "",
              });
              setOpenDialog(true);
            }}
          >
            Add New Patient
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Address</TableCell>
              <TableCell sx={{ color: "#fff" }}>Age</TableCell>
              <TableCell sx={{ color: "#fff" }}>Gender</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
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
                    <IconButton
                      onClick={() => {
                        setEditingPatient(patient);
                        setForm({
                          fullName: patient.fullName,
                          email: patient.email,
                          phone: patient.phone,
                          address: patient.address,
                          age: patient.age,
                          gender: patient.gender,
                          notes: patient.notes,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        setPatientToDelete(patient);
                        setConfirmOpen(true);
                      }}
                    >
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
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPatient ? "Edit Patient" : "Add New Patient"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={!!errors.fullName}
            helperText={errors.fullName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
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
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            error={!!errors.age}
            helperText={errors.age}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            error={!!errors.gender}
            helperText={errors.gender}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {patientToDelete?.fullName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
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
