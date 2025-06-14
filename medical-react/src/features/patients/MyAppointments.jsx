import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Button,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const statusColors = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAuth();
  const [authError, setAuthError] = useState("");

  const getToken = () => {
    return (
      (user && (user.access || user.token)) ||
      localStorage.getItem("access") ||
      localStorage.getItem("token") ||
      null
    );
  };

  const fetchAppointments = async () => {
    setAuthError("");
    const token = getToken();
    if (!token) {
      setAuthError("You are not authenticated. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost:8000/api/doctor/all-appointments/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setAuthError("Session expired. Please log in again.");
      } else {
        setAuthError("Error fetching appointments. Please try again later.");
      }
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;
    if (filterStatus) {
      filtered = filtered.filter((appt) => appt.status === filterStatus);
    }
    if (filterDate) {
      filtered = filtered.filter((appt) => appt.date.startsWith(filterDate));
    }
    setFilteredAppointments(filtered);
    setPage(1);
  }, [appointments, filterStatus, filterDate]);

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      setAuthError("You are not authenticated. Please log in again.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8000/api/doctor/one-appointment/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch (err) {
      setAuthError("Delete failed. Please try again later.");
      console.error("Delete failed", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleUpdate = async () => {
    const token = getToken();
    if (!token) {
      setAuthError("You are not authenticated. Please log in again.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/api/doctor/one-appointment/${selected.id}`,
        selected,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
      setEditOpen(false);
    } catch (err) {
      setAuthError("Update failed. Please try again later.");
      console.error("Update failed", err);
    }
  };

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (authError)
    return (
      <Typography color='error' sx={{ mt: 4 }}>
        {authError}
      </Typography>
    );

  return (
    <Box p={3}>
      <Typography variant='h4' align='center' fontWeight='bold' gutterBottom>
        My Appointments
      </Typography>

      <Box
        mb={3}
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexWrap='wrap'
        gap={2}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label='Status'
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='approved'>Approved</MenuItem>
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='rejected'>Rejected</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type='date'
          label='Filter Date'
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </Box>

      {paginatedAppointments.map((appt) => (
        <Card key={appt.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant='h6'>{appt.doctor_name}</Typography>
            <Typography variant='subtitle2' color='text.secondary'>
              Specialization: {appt.doctor_specialization}
            </Typography>
            <Typography>Date: {appt.date}</Typography>
            <Typography>Time: {appt.time}</Typography>
            <Chip
              label={appt.status}
              color={statusColors[appt.status]}
              sx={{ mt: 1 }}
            />
            <Box mt={1}>
              <IconButton
                onClick={() => {
                  setSelected(appt);
                  setViewOpen(true);
                }}
              >
                <Visibility color='primary' />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSelected(appt);
                  setEditOpen(true);
                }}
              >
                <Edit color='info' />
              </IconButton>
              <IconButton onClick={() => setConfirmDeleteId(appt.id)}>
                <Delete color='error' />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Pagination
        count={Math.ceil(filteredAppointments.length / itemsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {/* Dialogs below unchanged except layout fixes */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Typography>
                <strong>Doctor:</strong> {selected.doctor_name}
              </Typography>
              <Typography>
                <strong>Specialization:</strong> {selected.specialization}
              </Typography>
              <Typography>
                <strong>Date:</strong> {selected.date}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selected.time}
              </Typography>
              <Typography>
                <strong>Notes:</strong> {selected.notes}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selected.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Date'
            type='date'
            fullWidth
            value={selected?.date || ""}
            onChange={(e) => setSelected({ ...selected, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin='dense'
            label='Time'
            type='time'
            fullWidth
            value={selected?.time || ""}
            onChange={(e) => setSelected({ ...selected, time: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this appointment?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button
            color='error'
            onClick={() => handleDelete(confirmDeleteId)}
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAppointments;
