import React, { useEffect, useState } from "react";
import { 
  Box, TextField, Typography, Button, Paper,
  Avatar, Divider, InputAdornment, Modal, Backdrop, Fade,
  Alert, Snackbar, CircularProgress
} from "@mui/material";
import axiosInstance from "../../api/axios";
import {
  Person, Email, Phone, MedicalServices,
  Description, CheckCircle, Home
} from "@mui/icons-material";
import { styles } from "../doctorStyle/DoctorProfile.styles";

const DoctorProfile = () => {
  const [profile, setProfile] = useState({
    user: {
      username: "",
      email: "",
      password: ""  // This will be empty and won't be updated
    },
    specialization: "",
    phone: "",
    bio: "",
    image: null,
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/doctor/profile/update/');
        console.log('Profile data:', response.data);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested objects (e.g., user.email)
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      // Create a copy of the profile data without the password field
      const dataToSend = {
        ...profile,
        user: {
          ...profile.user,
          password: undefined // Remove password from the request
        }
      };
      
      const response = await axiosInstance.put('/doctor/profile/update/', dataToSend);
      console.log('Profile updated:', response.data);
      setProfile(response.data);
      setOpenSuccessModal(true);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

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
            src={profile.image || "/doctor-avatar.jpg"}
            sx={styles.avatar}
          />
        </Box>
        
        <TextField
          fullWidth
          label="Username"
          name="user.username"
          value={profile.user.username}
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
          name="user.email"
          value={profile.user.email}
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
          name="specialization"
          value={profile.specialization}
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
          label="Address"
          name="address"
          value={profile.address}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home color="primary" />
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
