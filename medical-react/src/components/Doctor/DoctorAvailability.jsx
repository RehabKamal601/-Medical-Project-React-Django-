import React, { useEffect, useState } from "react";
import {
  Box, Typography, FormGroup, FormControlLabel, Checkbox, TextField, Button, Grid, Paper, Divider, Chip, Stack,
  Modal, Backdrop, Fade
} from "@mui/material";
import axiosInstance from "../../api/axios";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Update the base URL to match your Django backend
  const API_BASE_URL = "http://localhost:8000/api";

  // Add axios interceptor for authentication
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("Please log in to access this feature");
      setLoading(false);
      return;
    }

    // Fetch doctor's availability
    const fetchAvailability = async () => {
      try {
        const response = await axiosInstance.get("/doctor/availability/");
        console.log('Availability response:', response.data);
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
        setError(error.response?.data?.error || "Failed to fetch availability");
      } finally {
        setLoading(false);
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
    setError("");
    try {
      console.log("Starting availability save...");
      console.log("Selected days:", selectedDays);

      // Delete existing availability
      console.log("Deleting existing availability...");
      await axiosInstance.delete("/doctor/availability/");

      // Create availability entries for each selected day
      console.log("Creating new availability entries...");
      const availabilityPromises = Object.entries(selectedDays).map(([day, times]) => {
        const data = {
          day: day,
          start_time: times.start,
          end_time: times.end
        };
        console.log("Posting availability for", day, ":", data);
        return axiosInstance.post("/doctor/availability/", data);
      });

      const results = await Promise.all(availabilityPromises);
      console.log("Save results:", results);
      
      // Fetch updated availability
      console.log("Fetching updated availability...");
      const response = await axiosInstance.get("/doctor/availability/");
      console.log("Updated availability:", response.data);
      setAvailability(response.data);
      setOpenSuccessModal(true);
    } catch (error) {
      console.error("Error saving availability:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      let errorMessage = "Failed to save availability";
      
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
      setIsSaving(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  // Component JSX
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

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
          <Stack direction="row" spacing={2} flexWrap="wrap">
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