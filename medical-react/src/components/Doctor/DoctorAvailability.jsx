import React, { useEffect, useState } from "react";
import {
  Box, Typography, FormGroup, FormControlLabel, Checkbox,
  TextField, Button, Grid, Paper, Divider, Chip, Stack,
  Modal, Backdrop, Fade
} from "@mui/material";
import axios from "axios";
import {
  Schedule, CheckCircle, AccessTime, 
  Alarm, CalendarToday, WatchLater
} from "@mui/icons-material";
import { styles } from "../doctorStyle/DoctorAvailability.styles";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DoctorAvailability = () => {
  const [selectedDays, setSelectedDays] = useState({});
  const [availability, setAvailability] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // Update the base URL to match your Django backend
  const API_BASE_URL = "http://localhost:8000/api";

  // Add axios interceptor for authentication
  useEffect(() => {
    // Add a request interceptor
    const interceptor = axios.interceptors.request.use(
      (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
          // Add token to headers
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('No authentication token found');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on component unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Fetch doctor's availability
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login first');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/availability/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAvailability(response.data);
        const initDays = {};
        response.data.forEach(item => {
          initDays[item.day] = {
            start: item.start_time,
            end: item.end_time
          };
        });
        setSelectedDays(initDays);
      } catch (error) {
        console.error("Error fetching availability:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert("Please login to view availability");
          // You might want to redirect to login page here
        } else {
          alert("Error loading availability. Please try again later.");
        }
      }
    };

    fetchAvailability();
  }, []);

  const handleCheckbox = (day) => {
    setSelectedDays(prev => {
      const updated = { ...prev };
      if (updated[day]) {
        delete updated[day];
      } else {
        updated[day] = { start: "09:00", end: "17:00" };
      }
      return updated;
    });
  };

  const handleTimeChange = (day, type, value) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Create availability entries for each selected day
      const availabilityPromises = Object.entries(selectedDays).map(([day, times]) => {
        return axios.post(`${API_BASE_URL}/availability/`, {
          day: day,
          start_time: times.start,
          end_time: times.end
        });
      });

      await Promise.all(availabilityPromises);
      
      // Fetch updated availability
      const response = await axios.get(`${API_BASE_URL}/availability/`);
      setAvailability(response.data);
      setIsSaving(false);
      setOpenSuccessModal(true);
    } catch (error) {
      console.error("Error saving availability:", error);
      setIsSaving(false);
      if (error.response?.status === 401) {
        alert("Please login to save availability");
      } else {
        alert("Error saving availability. Please try again later.");
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <Box sx={styles.mainContainer}>
      <Modal
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSuccessModal}>
          <Box sx={styles.successModal}>
            <CheckCircle sx={styles.successIcon} />
            <Typography variant="h5" component="h2" gutterBottom>
              Success
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Availability saved successfully
            </Typography>
            <Button
              variant="contained"
              onClick={handleCloseSuccessModal}
              sx={styles.continueButton}
            >
              Continue
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Typography variant="h4" gutterBottom sx={styles.pageTitle}>
        <Schedule fontSize="large" />
        Set Your Availability
      </Typography>
      
      <Paper elevation={3} sx={styles.mainPaper}>
        <Typography variant="h6" mb={3} sx={styles.sectionTitle}>
          <CalendarToday />
          Select Working Days
        </Typography>
        
        <Divider sx={styles.divider} />
        
        <FormGroup>
          <Grid container spacing={3}>
            {days.map(day => (
              <Grid item xs={12} md={6} key={day}>
                <Paper elevation={1} sx={styles.dayPaper(selectedDays[day] !== undefined)}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedDays[day] !== undefined}
                        onChange={() => handleCheckbox(day)}
                        color="primary"
                        icon={<AccessTime />}
                        checkedIcon={<CheckCircle />}
                      />
                    }
                    label={
                      <Typography variant="subtitle1" fontWeight="600">
                        {day}
                      </Typography>
                    }
                    sx={selectedDays[day] ? styles.dayLabel : {}}
                  />
                  
                  {selectedDays[day] && (
                    <Box sx={styles.timeContainer}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={styles.timeLabel}>
                            Start Time
                          </Typography>
                          <TextField
                            type="time"
                            value={selectedDays[day].start}
                            onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={styles.timeLabel}>
                            End Time
                          </Typography>
                          <TextField
                            type="time"
                            value={selectedDays[day].end}
                            onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </FormGroup>
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={isSaving}
            startIcon={<Alarm />}
            sx={styles.saveButton}
          >
            {isSaving ? "Saving..." : "Save Availability"}
          </Button>
        </Box>
      </Paper>
      
      {availability.length > 0 && (
        <Box sx={styles.availabilitySection}>
          <Typography variant="h6" sx={styles.availabilityTitle}>
            <WatchLater />
            Current Availability
          </Typography>
          <Stack direction="row" spacing={2}>
            {availability.map(item => (
              <Chip
                key={item.day}
                label={`${item.day}: ${item.start_time} - ${item.end_time}`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default DoctorAvailability;