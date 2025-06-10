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

const statusColors = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "error",
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

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/appointments?patientId=1"
      );
      setAppointments(res.data);
    } catch (err) {
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
      filtered = filtered.filter((appt) => appt.date === filterDate);
    }
    setFilteredAppointments(filtered);
    setPage(1);
  }, [appointments, filterStatus, filterDate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/appointments/${selected.id}`,
        selected
      );
      fetchAppointments();
      setEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box p={2}>
      <Typography variant='h5' mb={2}>
        My Appointments
      </Typography>

      <Box mb={2} display='flex' gap={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label='Status'
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='Confirmed'>Confirmed</MenuItem>
            <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='Cancelled'>Cancelled</MenuItem>
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
        <Card key={appt.id} sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant='subtitle1'>{appt.doctorName}</Typography>
            <Typography color='text.secondary'>{appt.specialty}</Typography>
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
        sx={{ mt: 2 }}
      />

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Typography>
                <strong>Doctor:</strong> {selected.doctorName}
              </Typography>
              <Typography>
                <strong>Date:</strong> {selected.date}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selected.time}
              </Typography>
              <Typography>
                <strong>Reason:</strong> {selected.reason}
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
