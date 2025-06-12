import React, { useEffect, useState } from "react";
import { 
  Box, TextField, Typography, Button, Paper,
  Avatar, Divider, InputAdornment, Modal, Backdrop, Fade,
  Alert, Snackbar, CircularProgress
} from "@mui/material";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import {
  Person, Email, Phone, MedicalServices,
  Description, CheckCircle, Home
} from "@mui/icons-material";

const styles = {
  container: {
    p: 3,
    maxWidth: 800,
    mx: 'auto'
  },
  title: {
    color: 'primary.main',
    mb: 4,
    fontWeight: 600
  },
  paper: {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mb: 3
  },
  avatar: {
    width: 120,
    height: 120,
    boxShadow: 2,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  textField: {
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main'
    }
  },
  bioField: {
    mt: 2,
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main'
    }
  },
  divider: {
    my: 3
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 2
  },
  saveButton: {
    minWidth: 150,
    fontWeight: 600
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center'
  },
  successIcon: {
    fontSize: 60,
    color: 'success.main',
    mb: 2
  },
  modalButton: {
    minWidth: 120
  }
};

const DoctorProfile = () => {
  const { user: authUser, updateUserData } = useAuth();
  const [profile, setProfile] = useState({
    user: {
      username: "",
      email: "",
      first_name: "",
      last_name: ""
    },
    specialization: "",
    phone: "",
    bio: "",
    image: null,
    address: "",
    imagePreview: null // For showing image preview before upload
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/doctor/profile/update/');
        console.log('Profile data:', response.data);
        
        // If there's an image URL in the response, set the preview
        const imageUrl = response.data.image;
        setProfile(prev => ({
          ...response.data,
          imagePreview: imageUrl // Use the image URL from backend as preview
        }));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        let errorMsg = 'Failed to load profile data. Please try again later.';
        
        if (err.response?.status === 401) {
          errorMsg = 'Please log in again to continue.';
        } else if (err.response?.status === 404) {
          errorMsg = 'Doctor profile not found. Please complete your registration.';
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      // Handle image upload
      const file = files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setFieldErrors(prev => ({
          ...prev,
          image: 'Please upload an image file'
        }));
        return;
      }
      setProfile(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setFieldErrors(prev => ({ ...prev, image: null }));
      return;
    }

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
    // Validate form before submitting
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();

      // Add user data as a single JSON string
      const userData = {
        first_name: profile.user.first_name?.trim() || '',
        last_name: profile.user.last_name?.trim() || '',
        email: profile.user.email?.trim() || '',
        username: profile.user.username?.trim() || ''
      };

      formData.append('user', JSON.stringify(userData));

      // Add profile data
      const profileFields = ['specialization', 'phone', 'bio', 'address'];
      profileFields.forEach(key => {
        const value = profile[key]?.trim() || '';
        formData.append(key, value);
      });

      // Add image if it's a File object
      if (profile.image instanceof File) {
        // Create a new file with a shorter name
        const fileExtension = profile.image.name.split('.').pop();
        const timestamp = new Date().getTime();
        const newFileName = `doctor_image_${timestamp}.${fileExtension}`;
        const renamedFile = new File([profile.image], newFileName, { type: profile.image.type });
        formData.append('image', renamedFile);
      }

      const response = await axiosInstance.put('/doctor/profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Server response:", response.data);

      // Update profile with response data
      setProfile(prev => ({
        ...response.data,
        imagePreview: response.data.image // Use the new image URL from response
      }));

      // Get the full image URL
      const imageUrl = response.data.image;
      
      // Update the user context with new data including the image URL
      const updatedUserData = {
        ...userData,
        specialization: response.data.specialization,
        image: imageUrl,
        doctor: {
          ...response.data
        }
      };
      
      console.log("Updating user context with:", updatedUserData);
      updateUserData(updatedUserData);
      
      setOpenSuccessModal(true);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      let errorMsg = 'Failed to update profile. Please try again.';
      const newFieldErrors = {};
      
      if (err.response?.data) {
        const errors = err.response.data;
        console.log('Server error response:', errors);
        if (typeof errors === 'object') {
          // Handle field-specific errors
          Object.entries(errors).forEach(([key, value]) => {
            // Handle nested user errors
            if (key === 'user' && typeof value === 'object') {
              Object.entries(value).forEach(([userKey, userValue]) => {
                newFieldErrors[`user.${userKey}`] = Array.isArray(userValue) ? userValue[0] : userValue;
              });
            } else {
              newFieldErrors[key] = Array.isArray(value) ? value[0] : value;
            }
          });
          
          errorMsg = 'Please correct the errors below';
        } else if (errors.detail) {
          errorMsg = errors.detail;
        }
      }
      
      setFieldErrors(newFieldErrors);
      setError(errorMsg);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!profile.user.first_name?.trim()) {
      newErrors['user.first_name'] = 'First name is required';
    }
    if (!profile.user.last_name?.trim()) {
      newErrors['user.last_name'] = 'Last name is required';
    }
    if (!profile.user.email?.trim()) {
      newErrors['user.email'] = 'Email is required';
    }
    if (!profile.specialization?.trim()) {
      newErrors['specialization'] = 'Specialty is required';
    }
    if (!profile.phone?.trim()) {
      newErrors['phone'] = 'Phone number is required';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  const handleCloseError = () => {
    setError(null);
    setFieldErrors({});
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
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
        keepMounted={false}
      >
        <Fade in={openSuccessModal}>
          <Box 
            sx={styles.modalContent}
            role="dialog"
            aria-modal="true"
          >
            <CheckCircle sx={styles.successIcon} />
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              id="success-modal-title"
            >
              Success
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ mb: 3 }}
              id="success-modal-description"
            >
              You have successfully updated your profile.
            </Typography>
            <Button
              variant="contained"
              onClick={handleCloseSuccessModal}
              sx={styles.modalButton}
              autoFocus
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
          <input
            accept="image/*"
            type="file"
            id="profile-image-upload"
            onChange={handleChange}
            style={{ display: 'none' }}
            name="image"
          />
          <label htmlFor="profile-image-upload">
            <Avatar
              src={profile.imagePreview || profile.image || "/doctor-avatar.jpg"}
              sx={{
                ...styles.avatar,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  filter: 'brightness(0.9)'
                }
              }}
            />
          </label>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Button
              component="span"
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                fontSize: '0.8rem',
                textTransform: 'none'
              }}
            >
              Change Photo
            </Button>
            {fieldErrors['image'] && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                {fieldErrors['image']}
              </Typography>
            )}
          </Box>
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
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="user.first_name"
            value={profile.user.first_name}
            onChange={handleChange}
            margin="normal"
            error={!!fieldErrors['user.first_name']}
            helperText={fieldErrors['user.first_name']}
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
            label="Last Name"
            name="user.last_name"
            value={profile.user.last_name}
            onChange={handleChange}
            margin="normal"
            error={!!fieldErrors['user.last_name']}
            helperText={fieldErrors['user.last_name']}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
            sx={styles.textField}
          />
        </Box>

        <TextField
          fullWidth
          label="Email"
          name="user.email"
          value={profile.user.email}
          onChange={handleChange}
          margin="normal"
          error={!!fieldErrors['user.email']}
          helperText={fieldErrors['user.email']}
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
          error={!!fieldErrors['phone']}
          helperText={fieldErrors['phone']}
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
          error={!!fieldErrors['specialization']}
          helperText={fieldErrors['specialization']}
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
          error={!!fieldErrors['address']}
          helperText={fieldErrors['address']}
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
          error={!!fieldErrors['bio']}
          helperText={fieldErrors['bio'] || 'Tell us about your medical experience and expertise'}
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
