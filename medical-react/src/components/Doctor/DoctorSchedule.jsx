import { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, Pagination, Alert, Snackbar, CircularProgress } from "@mui/material";
import { CheckCircle, CalendarToday } from "@mui/icons-material";
import axiosInstance from "../../api/axios";
import dayjs from "dayjs";
import { styles } from "../doctorStyle/DoctorSchedule.styles";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const itemsPerPage = 6;
  const AUTO_REFRESH_INTERVAL = 60000; // 1 minute
  const doctorId = 1; 
  
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up auto-refresh
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing appointments...");
      fetchData();
      setLastUpdate(new Date());
    }, AUTO_REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as we want this to run only once on mount

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching today's appointments...");
      const appointmentsRes = await axiosInstance.get("/doctor/appointments/", {
        params: {
          date: dayjs().format("YYYY-MM-DD"),
          status: "approved"
        }
      });
      
      console.log("Appointments response:", appointmentsRes.data);

      // Get only today's approved appointments
      const todaysAppointments = (appointmentsRes.data || []).filter(appt => {
        return dayjs(appt.date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD") 
          && appt.status === "approved";
      });

      setAppointments(todaysAppointments);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error response:", error.response);
      
      let errorMessage = "Failed to fetch schedule data";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.response?.status === 404) {
        errorMessage = "Doctor profile not found. Please complete your profile setup.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => {
    // Extract time from the date field if time field is not present
    const timeA = a.time || dayjs(a.date).format("HH:mm:ss");
    const timeB = b.time || dayjs(b.date).format("HH:mm:ss");
    return dayjs(timeA, "HH:mm:ss").valueOf() - dayjs(timeB, "HH:mm:ss").valueOf();
  });

  const getPatientFullName = (patient) => {
    if (!patient) return "Unknown Patient";
    if (patient.user) {
      return `${patient.user.first_name} ${patient.user.last_name}`.trim() || patient.user.username;
    }
    return patient.fullName || "Unknown Patient";
  };

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const paginatedAppointments = sortedAppointments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderCard = (appt) => (
    <Grid item xs={12} sm={6} md={4} key={appt.id}>
      <Paper elevation={0} sx={styles.appointmentCard}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight="600" 
              color="text.primary"
              sx={styles.patientName}
            >
              {getPatientFullName(appt.patient)}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={styles.timeInfo}
            >
              <CalendarToday sx={styles.timeIcon} />
              {dayjs(appt.date).format("DD/MM/YYYY")} - {appt.time || dayjs(appt.date).format("HH:mm")}
            </Typography>
          </Box>
          <CheckCircle sx={styles.statusIcon} />
        </Box>
        
        <Paper elevation={0} sx={styles.notesContainer}>
          <Typography 
            variant="body2" 
            sx={appt.notes ? styles.notes : styles.emptyNotes}
          >
            {appt.notes || "No additional notes"}
          </Typography>
        </Paper>
      </Paper>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <CalendarToday sx={styles.headerIcon} />
        <Box>
          <Typography variant="h5" fontWeight="700" color="text.primary">
            Today's Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs().format("dddd, MMMM D, YYYY")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Showing {appointments.length} approved {appointments.length === 1 ? 'appointment' : 'appointments'}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
            Last updated: {dayjs(lastUpdate).format("HH:mm:ss")}
          </Typography>
        </Box>
      </Box>

      {paginatedAppointments.length === 0 ? (
        <Box sx={styles.emptyStateContainer}>
          <Typography variant="h6" color="text.secondary">
            No appointments scheduled for today
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={styles.emptyStateSubtext}>
            Your approved appointments for today will appear here
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedAppointments.map(renderCard)}
          </Grid>

          {totalPages > 1 && (
            <Box sx={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={styles.pagination}
              />
            </Box>
          )}
        </>
      )}

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

export default DoctorSchedule;
