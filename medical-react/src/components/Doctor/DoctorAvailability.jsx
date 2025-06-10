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

  useEffect(() => {
    axios.get("http://localhost:5000/availability?doctorId=1").then(res => {
      setAvailability(res.data);
      const initDays = {};
      res.data.forEach(item => {
        initDays[item.day] = {
          start: item.startTime,
          end: item.endTime
        };
      });
      setSelectedDays(initDays);
    });
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

  const handleSave = () => {
    setIsSaving(true);
    axios.get("http://localhost:5000/availability?doctorId=1").then(res => {
      const deletes = res.data.map(item => 
        axios.delete(`http://localhost:5000/availability/${item.id}`)
      );
      
      Promise.all(deletes).then(() => {
        const posts = Object.entries(selectedDays).map(([day, times]) =>
          axios.post("http://localhost:5000/availability", {
            doctorId: 1,
            day,
            startTime: times.start,
            endTime: times.end
          })
        );
        
        Promise.all(posts)
          .then(() => {
            axios.get("http://localhost:5000/availability?doctorId=1").then(res => {
              setAvailability(res.data); 
              setIsSaving(false);
              setOpenSuccessModal(true);
            });
          })
          .catch(() => {
            setIsSaving(false);
            alert("Error saving availability");
          });
      });
    });
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
                label={`${item.day}: ${item.startTime} - ${item.endTime}`}
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