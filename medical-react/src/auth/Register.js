import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const theme = createTheme({
  palette: {
    primary: {
      main: "#199A8E",
      dark: "#0d7a70",
    },
    background: {
      default: "#F5F8FF",
    },
    text: {
      primary: "#101623",
    },
    error: {
      main: "#FF4D4D",
    },
  },
  typography: {
    fontFamily: "Poppins, Segoe UI, sans-serif",
  },
});

function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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
      case "name":
        error = value.trim() === "" ? "Name is required" : "";
        break;
      case "email":
        error =
          value.trim() === ""
            ? "Email is required"
            : !emailRegex.test(value)
            ? "Invalid email format"
            : "";
        break;
      case "username":
        error = value.trim() === "" ? "Username is required" : "";
        break;
      case "password":
        error =
          value.trim() === ""
            ? "Password is required"
            : value.length < 8
            ? "Password must be at least 8 characters"
            : "";
        break;
      case "confirmPassword":
        error = value !== formData.password ? "Passwords do not match" : "";
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
    const fields = ["name", "email", "username", "password", "confirmPassword"];
    let isValid = true;
    let newErrors = {};

    fields.forEach((field) => {
      const value = formData[field];
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
      setFormError("Please fill in all required fields correctly.");
      return;
    }

    const response = await registerUser({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: "patient" // Default role for new users
    });

    if (response.success) {
      navigate("/login");
    } else {
      setFormError(response.message);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(11,233,185,0.959) 0%, rgba(2,124,98,0.671) 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "rgba(245, 248, 255, 0.95)",
            borderRadius: 4,
            boxShadow: 6,
            p: 4,
            backdropFilter: "blur(10px)",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Avatar
              sx={{
                m: "auto",
                bgcolor: "primary.main",
                width: 80,
                height: 80,
                boxShadow: 3,
              }}
            >
              <PersonAddIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              color="primary"
              mt={2}
            >
              Create Your Account
            </Typography>
          </Box>

          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {["name", "email", "username", "password", "confirmPassword"].map(
              (field) => (
                <TextField
                  key={field}
                  label={
                    field === "confirmPassword"
                      ? "Confirm Password"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                fontWeight: "bold",
                boxShadow: 4,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              disabled={
                Object.values(formData).some((v) => !v) ||
                Object.values(errors).some((e) => e)
              }
            >
              Sign Up
            </Button>

            <Typography variant="body2" sx={{ mt: 2, color: "#64748b", textAlign: 'center' }}>
              Already have an account?
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                mt: 1,
                fontWeight: "bold",
                color: "primary.main",
                borderColor: "primary.main",
                "&:hover": {
                  backgroundColor: "#E0F2F1",
                  borderColor: "primary.dark",
                },
              }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </form>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Register;