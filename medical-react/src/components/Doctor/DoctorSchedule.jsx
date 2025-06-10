import { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, Pagination } from "@mui/material";
import { CheckCircle, CalendarToday } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { styles } from "../doctorStyle/DoctorSchedule.styles";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const doctorId = 1;

  useEffect(() => {
    axios
      .get("http://localhost:5000/appointments")
      .then((res) => setAppointments(res.data || []))
      .catch((err) => console.error("Error fetching appointments:", err));

    axios
      .get("http://localhost:5000/patients")
      .then((res) => setPatients(res.data || []))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const todayApprovedAppointments = appointments
    .filter(
      (appt) =>
        appt.doctorId === doctorId &&
        appt.status === "approved" &&
        dayjs(appt.date).isSame(dayjs(), "day")
    )
    .sort(
      (a, b) =>
        dayjs(a.time, "HH:mm").valueOf() - dayjs(b.time, "HH:mm").valueOf()
    );

  const getPatientFullName = (patientId) => {
    const patient = patients.find((p) => +p.id === +patientId);
    return patient ? patient.fullName : "Unknown Patient";
  };

  const totalPages = Math.ceil(todayApprovedAppointments.length / itemsPerPage);
  const paginatedAppointments = todayApprovedAppointments.slice(
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
              {getPatientFullName(appt.patientId)}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={styles.timeInfo}
            >
              <CalendarToday sx={styles.timeIcon} />
              {dayjs(appt.date).format("DD/MM/YYYY")} - {appt.time}
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

  return (
    <Box sx={styles.container}>
      <Box sx={styles.headerContainer}>
        <CalendarToday sx={styles.headerIcon} />
        <Box>
          <Typography variant="h5" fontWeight="700" color="text.primary">
            Today's Approved Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs().format("dddd, MMMM D, YYYY")}
          </Typography>
        </Box>
      </Box>

      {paginatedAppointments.length === 0 ? (
        <Box sx={styles.emptyStateContainer}>
          <Typography variant="h6" color="text.secondary">
            No appointments scheduled for today
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={styles.emptyStateSubtext}>
            All approved appointments will appear here
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
    </Box>
  );
};

export default DoctorSchedule;
