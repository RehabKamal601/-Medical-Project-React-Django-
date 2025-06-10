import React, { useEffect, useState } from "react";
import { 
  Box, TextField, Typography, Button, Paper,
  Avatar, Divider, InputAdornment, Modal, Backdrop, Fade
} from "@mui/material";
import axios from "axios";
import {
  Person, Email, Phone, MedicalServices,
  Description, CheckCircle
} from "@mui/icons-material";
import { styles } from "../doctorStyle/DoctorProfile.styles";

const DoctorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    bio: ""
  });
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const doctorId = 1;

  useEffect(() => {
    axios.get(`http://localhost:5000/doctors/${doctorId}`).then(res => {
      setProfile(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/doctors/${doctorId}`, profile)
      .then(() => {
        setOpenSuccessModal(true);
      })
      .catch(() => alert("Error updating profile"));
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <Box sx={styles.container}>
      {/* Success Modal */}
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
          <Box sx={styles.modalContent}>
            <CheckCircle sx={styles.successIcon} />
            <Typography variant="h5" component="h2" gutterBottom>
              Success
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You have successfully updated your profile.
            </Typography>
            <Button
              variant="contained"
              onClick={handleCloseSuccessModal}
              sx={styles.modalButton}
            >
              Continue
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Typography variant="h4" gutterBottom sx={styles.title}>
        Doctor Profile
      </Typography>
      
      <Paper elevation={3} sx={styles.paper}>
        <Box sx={styles.avatarContainer}>
          <Avatar
            src="/doctor-avatar.jpg"
            sx={styles.avatar}
          />
        </Box>
        
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="primary" />
              </InputAdornment>
            ),
          }}
          sx={styles.textField}
        />
        
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="primary" />
              </InputAdornment>
            ),
          }}
          sx={styles.textField}
        />
        
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone color="primary" />
              </InputAdornment>
            ),
          }}
          sx={styles.textField}
        />
        
        <TextField
          fullWidth
          label="Specialty"
          name="specialty"
          value={profile.specialty}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MedicalServices color="primary" />
              </InputAdornment>
            ),
          }}
          sx={styles.textField}
        />
        
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Description color="primary" />
              </InputAdornment>
            ),
          }}
          sx={styles.bioField}
        />
        
        <Divider sx={styles.divider} />
        
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={styles.saveButton}
          >
            Save Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DoctorProfile;
