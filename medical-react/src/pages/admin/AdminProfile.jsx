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
} from "@mui/material";
import {
  Edit,
  Save,
  CalendarToday,
  Person,
  Work,
  School,
  Notifications,
  CloudUpload,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

const AdminProfile = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Fetch admin data (assuming the current admin is user with id 1)
        const adminResponse = await fetch("http://localhost:5000/users/1");
        const admin = await adminResponse.json();

        // Fetch activity log (using notifications as activity log)
        const activityResponse = await fetch(
          "http://localhost:5000/notifications"
        );
        const activities = await activityResponse.json();

        setAdminData({
          ...admin,
          lastLogin: new Date().toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          position: "System Administrator",
          department: "IT",
          employeeId: "EMP-ADM-042",
          joinDate: "10/02/2018",
          responsibilities:
            "Manage hospital systems, user accounts, and security policies",
          education: [
            {
              institution: "Cairo University",
              degree: "Bachelor of Computer Science",
              period: "2003 - 2007",
              description:
                "Specialized in Information Systems and Network Security",
            },
            {
              institution:
                "Certified Information Systems Security Professional (CISSP)",
              degree: "ISC2",
              period: "2010",
            },
          ],
        });

        // Transform notifications to activity log format
        const transformedActivities = activities
          .slice(0, 5)
          .map((activity, index) => ({
            id: index,
            time: new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            action:
              activity.message || `System notification: ${activity.status}`,
            icon: <Notifications color="primary" />,
          }));

        setActivityLog(transformedActivities);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      await fetch(`http://localhost:5000/users/1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading && !adminData) {
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

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
      }}
    >
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
              <Tab label="Education" icon={<School />} iconPosition="start" />
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
                      label="Username"
                      value={adminData.username}
                      variant="outlined"
                      disabled
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={adminData.role}
                      variant="outlined"
                      disabled
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                      value={adminData.phone || ""}
                      variant="outlined"
                      disabled={!editMode}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={adminData.location || ""}
                      variant="outlined"
                      disabled={!editMode}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={adminData.employeeId}
                      variant="outlined"
                      disabled
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Join Date"
                      value={adminData.joinDate}
                      variant="outlined"
                      disabled
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
                  Education & Qualifications
                </Typography>

                {adminData.education.map((edu, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {edu.institution}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.degree} • {edu.period}
                    </Typography>
                    {edu.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {edu.description}
                      </Typography>
                    )}
                  </Box>
                ))}

                {editMode && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudUpload />}
                    sx={{ borderRadius: "12px" }}
                  >
                    Add Certification
                  </Button>
                )}
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Activity Log
                </Typography>

                <List dense>
                  {activityLog.map((item, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: `${item.icon.props.color}.light`,
                            color: `${item.icon.props.color}.main`,
                            width: 32,
                            height: 32,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.action}
                        secondary={item.time}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </ProfileCard>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AdminProfile;
