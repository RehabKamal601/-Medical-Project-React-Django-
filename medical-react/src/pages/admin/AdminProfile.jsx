import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  styled,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit,
  Save,
  CalendarToday,
  Person,
  Work,
  Notifications,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileCard = styled(Paper)(({ theme }) => ({
  background: `rgba(${
    theme.palette.mode === "dark" ? "30,30,30" : "255,255,255"
  }, 0.8)`,
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: theme.shadows[10],
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[16],
  },
}));

const API_URL = "http://127.0.0.1:8000/api/admin";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const AdminProfile = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1234567890",
    position: "System Administrator",
    department: "IT",
    responsibilities: "Manage system users and configurations",
  });
  const [activityLog, setActivityLog] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      // محاولة جلب بيانات البروفايل
      try {
        const adminResponse = await axios.get(`${API_URL}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminData(adminResponse.data);
      } catch (profileError) {
        console.warn("Using fallback profile data:", profileError.message);
      }

      // محاولة جلب سجل النشاطات
      try {
        const activityResponse = await axios.get(`${API_URL}/activity-logs/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActivityLog(activityResponse.data.slice(0, 5));
      } catch (activityError) {
        console.warn("Using empty activity log:", activityError.message);
        setActivityLog([
          {
            id: 1,
            action: "System initialized",
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error in fetchAdminData:", error);
      setSnackbar({
        open: true,
        message: "Failed to load profile data",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleUnauthorized = () => {
    setSnackbar({
      open: true,
      message: "Session expired. Please login again.",
      severity: "error",
    });
    setTimeout(() => navigate("/admin/login"), 2000);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      await axios.patch(`${API_URL}/profile/`, adminData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to update profile",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #199A8E, #45b0a5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Admin Profile
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={editMode ? <Save /> : <Edit />}
          onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
          disabled={loading}
          sx={{
            borderRadius: "12px",
            px: 3,
            boxShadow: theme.shadows[4],
          }}
        >
          {editMode ? (loading ? "Saving..." : "Save Changes") : "Edit Profile"}
        </Button>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4}>
          <ProfileCard sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "3rem",
                }}
              >
                {adminData.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {adminData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {adminData.position}
              </Typography>

              <Box sx={{ mt: 3, width: "100%" }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Account Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography>{adminData.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography>
                    {new Date().toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ProfileCard>
        </Grid>

        {/* Right Column - Main Content */}
        <Grid item xs={12} md={8}>
          <ProfileCard>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  label="Personal Info"
                  icon={<Person />}
                  iconPosition="start"
                />
                <Tab
                  label="Professional Info"
                  icon={<Work />}
                  iconPosition="start"
                />
                <Tab
                  label="Activity Log"
                  icon={<CalendarToday />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={adminData.name}
                        variant="outlined"
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={adminData.email}
                        variant="outlined"
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={adminData.phone}
                        variant="outlined"
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Professional Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={adminData.position}
                        variant="outlined"
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("position", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={adminData.department}
                        variant="outlined"
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Responsibilities"
                        value={adminData.responsibilities}
                        variant="outlined"
                        disabled={!editMode}
                        onChange={(e) =>
                          handleInputChange("responsibilities", e.target.value)
                        }
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity Log
                  </Typography>

                  <List dense>
                    {activityLog.map((item) => (
                      <ListItem key={item.id} sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              color: "primary.main",
                              width: 32,
                              height: 32,
                            }}
                          >
                            <Notifications color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.action}
                          secondary={new Date(item.timestamp).toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </ProfileCard>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfile;
