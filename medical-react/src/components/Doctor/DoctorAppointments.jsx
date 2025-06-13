import { useEffect, useState } from "react";
import {
  Typography, Paper, Box, Button, TextField, Grid,
  Chip, Avatar, Divider, IconButton, Stack, Tabs, Tab, MenuItem,
  Select, InputLabel, FormControl, Pagination, Alert, Snackbar
} from "@mui/material";
import axiosInstance from "../../api/axios";
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Edit,
  CalendarToday,
  WatchLater,
  Notes,
  Save,
  Close,
  FilterAlt,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { styles } from "../doctorStyle/DoctorAppointments.styles";
import { useAuth } from "../../hooks/useAuth";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNotes, setEditingNotes] = useState(null);
  const [tempNotes, setTempNotes] = useState("");
  const [tab, setTab] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const { user } = useAuth();
  const [authError, setAuthError] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      setAuthError("");
      const token = getToken();
      if (!token) {
        setAuthError("You are not authenticated. Please log in again.");
        return;
      }
      try {
        const response = await axiosInstance.get("http://localhost:8000/api/doctor/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setAuthError("Session expired. Please log in again.");
        } else {
          setAuthError("Error fetching appointments. Please try again later.");
        }
        console.error("Axios Error:", error);
      }
    };
    fetchAppointments();
  }, []);

  const getToken = () => {
    return (
      (user && (user.access || user.token)) ||
      localStorage.getItem("access") ||
      localStorage.getItem("token") ||
      null
    );
  };

  const handleStatusChange = (id, status) => {
    setAuthError("");
    const token = getToken();
    if (!token) {
      setAuthError("You are not authenticated. Please log in again.");
      return;
    }
    axiosInstance.patch(`http://localhost:8000/api/doctor/appointments/${id}/`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setAppointments(prev =>
          prev.map(appt =>
            appt.id === id ? { ...appt, status } : appt
          )
        );
        setSuccessMessage("Status updated successfully.");
        setOpenSuccessModal(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setAuthError("Session expired. Please log in again.");
        } else {
          setAuthError("Status update failed. Please try again later.");
        }
        console.error("Status update failed", error);
      });
  };

  const handleNoteChange = (id, note) => {
    setAuthError("");
    const token = getToken();
    if (!token) {
      setAuthError("You are not authenticated. Please log in again.");
      return;
    }
    axiosInstance.patch(`http://localhost:8000/api/doctor/appointments/${id}/`, { notes: note }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setAppointments(prev =>
          prev.map(appt =>
            appt.id === id ? { ...appt, notes: note } : appt
          )
        );
        setSuccessMessage("Notes updated successfully.");
        setOpenSuccessModal(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setAuthError("Session expired. Please log in again.");
        } else {
          setAuthError("Note update failed. Please try again later.");
        }
        console.error("Note update failed", error);
      });
  };

  const startEditing = (appt) => {
    setEditingNotes(appt.id);
    setTempNotes(appt.notes || "");
  };

  const saveNotes = (id) => {
    handleNoteChange(id, tempNotes);
    setEditingNotes(null);
  };

  const cancelEditing = () => {
    setEditingNotes(null);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return (
          <Chip
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label="Approved"
            color="success"
            size="small"
            sx={styles.statusChip.approved}
          />
        );
      case "rejected":
        return (
          <Chip
            icon={<Cancel sx={{ fontSize: 16 }} />}
            label="Rejected"
            color="error"
            size="small"
            sx={styles.statusChip.rejected}
          />
        );
      default:
        return (
          <Chip
            icon={<AccessTime sx={{ fontSize: 16 }} />}
            label="Pending"
            color="warning"
            size="small"
            sx={styles.statusChip.pending}
          />
        );
    }
  };

  const now = dayjs();

  const sortByDateDesc = (list) =>
    [...list].sort(
      (a, b) =>
        dayjs(`${b.date} ${b.time}`).valueOf() -
        dayjs(`${a.date} ${a.time}`).valueOf()
    );

  const filteredAppointments = (status, isPast = false) => {
    let filtered = appointments;

    if (isPast) {
      filtered = filtered.filter((appt) =>
        dayjs(`${appt.date} ${appt.time}`).isBefore(now)
      );
    } else if (status) {
      filtered = filtered.filter((appt) => appt.status === status);
    }

    return sortByDateDesc(
      filtered.filter((appt) => {
        const appointmentDate = dayjs(`${appt.date} ${appt.time}`);
        const dayName = appointmentDate.format("dddd");

        if (filterType === "all") return true;
        if (filterType === "day" && selectedDay) return dayName === selectedDay;
        if (filterType === "date" && selectedDate)
          return appt.date === selectedDate;
        return false;
      })
    );
  };

  const pendingAppointments = filteredAppointments("pending");
  const acceptedAppointments = filteredAppointments("approved");
  const rejectedAppointments = filteredAppointments("rejected");
  const pastAppointments = filteredAppointments(null, true);

  const paginate = (data) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return { data: paginatedData, totalPages };
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderAppointmentCard = (appt) => (
    <Grid item xs={12} sm={6} md={2} key={appt.id}>
      <Paper elevation={0} sx={styles.appointmentCard}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
          <Avatar
            sx={{
              ...styles.avatar,
              bgcolor:
                appt.status === "approved"
                  ? "#10b981"
                  : appt.status === "rejected"
                  ? "#ef4444"
                  : "#f59e0b",
            }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary" fontSize="1rem">
              {appt.patient_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="0.9rem">
              ID: {appt.patient_id}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={styles.divider} />

        <Box mb={1.5}>
          <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
            <CalendarToday sx={styles.statusIcon} />
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="0.9rem"
            >
              {dayjs(appt.date).format("DD/MM/YYYY")}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
            <WatchLater sx={styles.statusIcon} />
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="0.9rem"
            >
              {appt.time}
            </Typography>
          </Stack>
          <Box>{getStatusChip(appt.status)}</Box>
        </Box>

        <Box mt="auto">
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.primary"
            mb={1}
            display="flex"
            alignItems="center"
            fontSize="0.95rem"
          >
            <Notes sx={{ mr: 0.5, ...styles.statusIcon }} />
            Notes
          </Typography>
          {editingNotes === appt.id ? (
            <Box>
              <TextField
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                size="small"
                sx={styles.notesField}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Save sx={{ fontSize: 18 }} />}
                  onClick={() => saveNotes(appt.id)}
                  sx={styles.saveButton}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Close sx={{ fontSize: 18 }} />}
                  onClick={cancelEditing}
                  sx={styles.cancelButton}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          ) : (
            <Paper variant="outlined" sx={styles.notesPaper}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: "100%", fontSize: "0.9rem" }}
              >
                {appt.notes || "No notes added"}
              </Typography>
              <IconButton
                size="small"
                onClick={() => startEditing(appt)}
                sx={styles.editButton}
              >
                <Edit fontSize="small" sx={{ fontSize: 18 }} />
              </IconButton>
            </Paper>
          )}
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1.5}>
          {appt.status !== "approved" && (
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircle sx={{ fontSize: 18 }} />}
              onClick={() => handleStatusChange(appt.id, "approved")}
              sx={styles.approveButton}
            >
              Approve
            </Button>
          )}
          {appt.status !== "rejected" && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Cancel sx={{ fontSize: 18 }} />}
              onClick={() => handleStatusChange(appt.id, "rejected")}
              sx={styles.rejectButton}
            >
              Reject
            </Button>
          )}
        </Stack>
      </Paper>
    </Grid>
  );

  const renderAppointments = (data) => {
    const { data: paginatedData, totalPages } = paginate(data);

    return (
      <>
        <Grid container spacing={2}>
          {paginatedData.length ? (
            paginatedData.map(renderAppointmentCard)
          ) : (
            <Grid item xs={12}>
              <Paper sx={styles.noAppointmentsPaper}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontSize="1.1rem"
                >
                  No appointments found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ mt: 1, fontSize: "0.9rem" }}
                >
                  {tab === 0 && "No pending appointments available"}
                  {tab === 1 && "No accepted appointments available"}
                  {tab === 2 && "No rejected appointments available"}
                  {tab === 3 && "No past appointments available"}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {totalPages > 1 && (
          <Box sx={styles.paginationBox}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="small"
              sx={styles.pagination}
            />
          </Box>
        )}
      </>
    );
  };

  if (authError) return <Typography color="error" sx={{ mt: 4 }}>{authError}</Typography>;

  return (
    <Box sx={styles.mainBox}>
      <Box sx={styles.headerBox}>
        <CalendarToday sx={styles.calendarIcon} />
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            fontSize="1.25rem"
          >
            Appointments Management
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.9rem">
            Manage and review all patient appointments
          </Typography>
        </Box>
      </Box>

      <Paper sx={styles.filterPaper}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <FilterAlt sx={styles.filterIcon} />
          <FormControl size="small" sx={styles.formControl}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              label="Filter Type"
              sx={styles.selectStyle}
            >
              <MenuItem value="all" sx={styles.menuItemStyle}>
                All Appointments
              </MenuItem>
              <MenuItem value="day" sx={styles.menuItemStyle}>
                By Day of Week
              </MenuItem>
              <MenuItem value="date" sx={styles.menuItemStyle}>
                By Specific Date
              </MenuItem>
            </Select>
          </FormControl>

          {filterType === "day" && (
            <FormControl size="small" sx={styles.dayFormControl}>
              <InputLabel>Select Day</InputLabel>
              <Select
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setPage(1);
                }}
                label="Select Day"
                sx={styles.selectStyle}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day} sx={styles.menuItemStyle}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {filterType === "date" && (
            <TextField
              label="Select Date"
              type="date"
              size="small"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={styles.dateField}
              inputProps={{ style: { fontSize: "0.85rem" } }}
            />
          )}

          {filterType !== "all" && (selectedDay || selectedDate) && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedDay("");
                setSelectedDate("");
                setPage(1);
              }}
              sx={styles.clearButton}
            >
              Clear Filters
            </Button>
          )}
        </Stack>
      </Paper>

      <Paper sx={styles.tabsPaper}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => {
            setTab(newVal);
            setFilterType("all");
            setSelectedDay("");
            setSelectedDate("");
            setPage(1);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={styles.tabs}
        >
          <Tab label="Pending" />
          <Tab label="Accepted" />
          <Tab label="Rejected" />
          <Tab label="Past Appointments" />
        </Tabs>
      </Paper>

      {tab === 0 && renderAppointments(pendingAppointments)}
      {tab === 1 && renderAppointments(acceptedAppointments)}
      {tab === 2 && renderAppointments(rejectedAppointments)}
      {tab === 3 && renderAppointments(pastAppointments)}

      {/* Success Snackbar */}
      <Snackbar
        open={openSuccessModal}
        autoHideDuration={6000}
        onClose={() => setOpenSuccessModal(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSuccessModal(false)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};


export default DoctorAppointments;