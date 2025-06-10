import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Pagination,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MessageIcon from '@mui/icons-material/Message';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styles } from '../doctorStyle/DoctorPatientsList.styles';

const DoctorPatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const patientsPerPage = 6;
  const doctorId = "d1"; // Can be changed based on the required doctor

  useEffect(() => {
    const fetchDoctorPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/db.json');
        const data = await response.json();
        
        // Filter completed appointments for this doctor
        const completedAppointments = data.appointments.filter(app => 
          app.doctorId === doctorId && 
          app.status === 'completed' &&
          new Date(app.date) < new Date()
        );
        setAppointments(completedAppointments);

        // Get unique patient IDs from completed appointments
        const uniquePatientIds = [...new Set(completedAppointments.map(app => app.patientId))];

        // Get patients data for those with completed appointments
        const doctorPatients = data.patients.filter(
          patient => uniquePatientIds.includes(patient.id)
        );
        setPatients(doctorPatients);
      } catch (error) {
        console.error('Error fetching doctor patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorPatients();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getPatientAppointments = (patientId) => {
    return appointments.filter(app => app.patientId === patientId);
  };

  const getLatestAppointment = (patientId) => {
    const patientAppointments = getPatientAppointments(patientId);
    if (patientAppointments.length === 0) return null;
    
    return patientAppointments.reduce((latest, current) => {
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PatientCard = ({ patient }) => {
    const latestAppointment = getLatestAppointment(patient.id);
    const totalAppointments = getPatientAppointments(patient.id).length;

    return (
      <Box sx={styles.patientCard}>
        <Box sx={styles.patientInfo}>
          <Avatar 
            src={patient.image} 
            sx={styles.avatar}
          >
            {patient.fullName?.charAt(0)}
          </Avatar>
          <Box sx={styles.nameContainer}>
            <Typography sx={styles.name}>
              {patient.fullName}
            </Typography>
            <Typography sx={styles.patientId}>
              ID: {patient.id} | {patient.contact}
            </Typography>
          </Box>
        </Box>

        <Box sx={styles.detailsGrid}>
          <Box sx={styles.detailItem}>
            <Typography sx={styles.detailLabel}>Age</Typography>
            <Typography sx={styles.detailValue}>{patient.age} years</Typography>
          </Box>
          <Box sx={styles.detailItem}>
            <Typography sx={styles.detailLabel}>Gender</Typography>
            <Typography sx={styles.detailValue}>{patient.gender}</Typography>
          </Box>
          <Box sx={styles.detailItem}>
            <Typography sx={styles.detailLabel}>Total Visits</Typography>
            <Typography sx={styles.detailValue}>
              {totalAppointments}
            </Typography>
          </Box>
          <Box sx={styles.detailItem}>
            <Typography sx={styles.detailLabel}>Last Visit</Typography>
            <Typography sx={styles.detailValue}>
              {latestAppointment ? new Date(latestAppointment.date).toLocaleDateString('en-US') : 'None'}
            </Typography>
          </Box>
        </Box>

        {latestAppointment && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ ...styles.detailLabel, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
              Last Appointment Details
            </Typography>
            <Typography sx={{ ...styles.detailValue, color: getStatusColor(latestAppointment.status) }}>
              Date: {new Date(latestAppointment.date).toLocaleDateString('en-US')}
              <br />
              Time: {latestAppointment.time}
              <br />
              Status: {latestAppointment.status}
            </Typography>
          </Box>
        )}

        <Box sx={styles.actionButtons}>
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            sx={styles.viewButton}
          >
            View Medical Record
          </Button>
          <Button
            variant="outlined"
            startIcon={<MessageIcon />}
            sx={styles.messageButton}
          >
            Message
          </Button>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading patients data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography sx={styles.title}>
          Patients List
        </Typography>
        <Typography sx={styles.subtitle}>
          {filteredPatients.length} Registered Patients
        </Typography>
      </Box>

      <Box sx={styles.searchContainer}>
        <TextField
          placeholder="Search patients..."
          value={searchTerm}
          onChange={handleSearch}
          sx={styles.searchField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={styles.filterButton}
        >
          Filter
        </Button>
      </Box>

      {filteredPatients.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No patients found</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredPatients
              .slice((page - 1) * patientsPerPage, page * patientsPerPage)
              .map(patient => (
                <Grid item xs={12} md={6} key={patient.id}>
                  <PatientCard patient={patient} />
                </Grid>
            ))}
          </Grid>

          <Box sx={styles.paginationContainer}>
            <Pagination
              count={Math.ceil(filteredPatients.length / patientsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DoctorPatientsList;