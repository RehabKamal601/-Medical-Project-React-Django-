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
  Chip,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    date: "",
    time: "",
    notes: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctor) newErrors.doctor = "Doctor is required";
    if (!formData.patient) newErrors.patient = "Patient is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAppointments = async () => {
    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/appointments/", { headers }),
        fetch("http://127.0.0.1:8000/api/admin/doctors/", { headers }),
        fetch("http://127.0.0.1:8000/api/admin/patients/", { headers }),
      ]);

      if (
        [appointmentsRes, doctorsRes, patientsRes].some(
          (res) => res.status === 401
        )
      ) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/admin/login");
        return;
      }

      const appointmentsData = await appointmentsRes.json();
      const doctorsData = await doctorsRes.json();
      const patientsData = await patientsRes.json();
      setAppointments(
        Array.isArray(appointmentsData)
          ? appointmentsData
          : appointmentsData.results || appointmentsData.data || []
      );
      setDoctors(
        Array.isArray(doctorsData)
          ? doctorsData
          : doctorsData.results || doctorsData.data || []
      );
      setPatients(
        Array.isArray(patientsData)
          ? patientsData
          : patientsData.results || patientsData.data || []
      );
    } catch (error) {
      showSnackbar("Failed to fetch data", "error");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenAdd = () => {
    setEditingAppointment(null);
    setFormData({
      doctor: "",
      patient: "",
      date: "",
      time: "",
      notes: "",
      status: "pending",
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      doctor: appointment.doctor?.id || "",
      patient: appointment.patient?.id || "",
      date: appointment.date || "",
      time: appointment.time || "",
      notes: appointment.notes || "",
      status: appointment.status || "pending",
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, status });
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const url = editingAppointment
        ? `http://127.0.0.1:8000/api/admin/appointments/${editingAppointment.id}/`
        : "http://127.0.0.1:8000/api/admin/appointments/";
      const method = editingAppointment ? "PUT" : "POST";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestData = {
        doctor: formData.doctor,
        patient: formData.patient,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: formData.status,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });

      if (response.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/admin/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to save appointment");

      fetchAppointments();
      setOpenDialog(false);
      showSnackbar(
        editingAppointment
          ? "Appointment updated successfully"
          : "Appointment added successfully"
      );
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/appointments/${selectedAppointment.id}/`,
        {
          method: "DELETE",
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
        navigate("/admin/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to delete appointment");

      fetchAppointments();
      setOpenConfirmDialog(false);
      showSnackbar("Appointment deleted successfully");
    } catch (error) {
      showSnackbar(error.message, "error");
      setOpenConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : "N/A";
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "N/A";
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <Box sx={{ backgroundColor: "#F5F8FF", minHeight: "100vh", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "24px" }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: "#199A8E", fontWeight: "bold" }}
        >
          Appointments Management
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add New Appointment
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Doctor</TableCell>
              <TableCell sx={{ color: "#fff" }}>Patient</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>Time</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>#{appointment.id}</TableCell>
                <TableCell>
                  {getDoctorName(appointment.doctor?.id || appointment.doctor)}
                </TableCell>
                <TableCell>
                  {getPatientName(
                    appointment.patient?.id || appointment.patient
                  )}
                </TableCell>
                <TableCell>{appointment.date || "N/A"}</TableCell>
                <TableCell>{appointment.time || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status || "pending"}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(appointment)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(appointment)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAppointment ? "Edit Appointment" : "Add Appointment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Doctor *"
            name="doctor"
            fullWidth
            value={formData.doctor}
            onChange={handleInputChange}
            error={!!errors.doctor}
            helperText={errors.doctor}
          >
            <MenuItem value="">Select Doctor</MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Patient *"
            name="patient"
            fullWidth
            value={formData.patient}
            onChange={handleInputChange}
            error={!!errors.patient}
            helperText={errors.patient}
          >
            <MenuItem value="">Select Patient</MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Date *"
            name="date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date}
          />
          <TextField
            margin="dense"
            label="Time *"
            name="time"
            type="time"
            fullWidth
            value={formData.time}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.time}
            helperText={errors.time}
          />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Status *</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant={
                  formData.status === "approved" ? "contained" : "outlined"
                }
                color="success"
                onClick={() => handleStatusChange("approved")}
              >
                Approved
              </Button>
              <Button
                variant={
                  formData.status === "pending" ? "contained" : "outlined"
                }
                color="warning"
                onClick={() => handleStatusChange("pending")}
              >
                Pending
              </Button>
              <Button
                variant={
                  formData.status === "rejected" ? "contained" : "outlined"
                }
                color="error"
                onClick={() => handleStatusChange("rejected")}
              >
                Rejected
              </Button>
            </Box>
          </Box>
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingAppointment ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete appointment #{selectedAppointment?.id}
          ?
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
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentsList;
