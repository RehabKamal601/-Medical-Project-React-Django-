import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/AuthStyles.css";
import {
  TextField,
  Button,
  Alert,
  Typography,
  Box
} from "@mui/material";

// Primary color and its variants
const primaryColor = "#199A8E";
const primaryLight = "#E0F2F1";
const primaryDark = "#0D6E64";

function Login() {
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

    try {
      const res = await fetch("http://localhost:5000/users");
      const users = await res.json();

      const matchedUser = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (!matchedUser) {
        setFormError("Invalid email or password.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(matchedUser));

      switch (matchedUser.role) {
        case "admin":
          navigate("/admin");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        case "patient":
          navigate("/patient");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="auth-container">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1S1f3JArA7vEeeUQ5yQXwwtTcBxE87X0KHg&s"
        alt="Logo"
        className="auth-logo"
      />
      <Typography 
        className="auth-title"
        sx={{ 
          color: primaryColor,
          fontWeight: 600,
          mb: 3
        }}
      >
        Welcome Back
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
        
        {/* Register Button */}
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
    </div>
  );
}

export default Login;