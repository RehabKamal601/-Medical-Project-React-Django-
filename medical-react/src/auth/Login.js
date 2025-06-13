import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const primaryColor = "#199A8E";
const primaryLight = "#E0F2F1";
const primaryDark = "#0D6E64";

function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
    setFormError("");
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        error =
          value.trim() === ""
            ? "Email is required"
            : !emailRegex.test(value)
            ? "Invalid email format"
            : "";
        break;
      case "password":
        error =
          value.trim() === ""
            ? "Password is required"
            : value.length < 8
            ? "Password must be at least 8 characters"
            : "";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    Object.entries(formData).forEach(([field, value]) => {
      validateField(field, value);
      if (value.trim() === "") {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      setFormError("Please correct the errors before submitting.");
      return;
    }

    const response = await loginUser(formData);

    if (response.success) {
      // 🟢 تخزين patientId في localStorage
      if (response.user && response.user.id) {
        localStorage.setItem("patientId", response.user.id);
      }

      if (response.role === 'doctor') {
        navigate('/doctor');
      } else if (response.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/patient');
      }
    } else {
      setFormError(response.message);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
      <Box 
        mt={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1S1f3JArA7vEeeUQ5yQXwwtTcBxE87X0KHg&s"
          alt="Logo"
          style={{ width: '100px', marginBottom: '20px' }}
        />
        <Typography 
          variant="h4"
          sx={{ 
            color: primaryColor,
            fontWeight: 600,
            mb: 3
          }}
        >
          Welcome Back
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          /> 
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: primaryColor,
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: primaryDark,
              },
            }}
            disabled={
              Object.values(formData).some((v) => !v) ||
              Object.values(errors).some((e) => e)
            }
          >
            Log In
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
              Don't have an account?
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                py: 1.5,
                borderColor: primaryColor,
                color: primaryColor,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: primaryLight,
                  borderColor: primaryDark,
                },
              }}
              onClick={handleRegisterClick}
            >
              Register Now
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
