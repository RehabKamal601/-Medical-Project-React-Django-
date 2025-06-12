import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Stack,
  Divider,
  Chip,
  LinearProgress,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  EventAvailable as EventAvailableIcon,
  SettingsApplications as SettingsApplicationsIcon,
  Report as ReportIcon,
  Notifications as NotificationsIcon,
  MedicalServices as MedicalServicesIcon,
  CalendarMonth as CalendarMonthIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin";

const AdminHomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointmentsToday: 0,
    systemAlerts: 0,
    loading: true,
    error: null,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Updated API endpoints to match backend routes
        const [
          doctorsRes,
          patientsRes,
          appointmentsRes,
          alertsRes,
          activitiesRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/doctors`, { headers }),
          axios.get(`${API_URL}/patients`, { headers }),
          axios.get(`${API_URL}/appointments`, { headers }),
          axios.get(`${API_URL}/notifications`, { headers }),
          axios.get(`${API_URL}/system-alerts`, { headers }),
          axios.get(`${API_URL}/activity-logs`, { headers }),
        ]);

        setStats({
          doctors: doctorsRes.data?.count || doctorsRes.data?.length || 0,
          patients: patientsRes.data?.count || patientsRes.data?.length || 0,
          appointmentsToday:
            appointmentsRes.data?.count || appointmentsRes.data?.length || 0,
          systemAlerts: alertsRes.data?.count || alertsRes.data?.length || 0,
          loading: false,
        });

        const activitiesData =
          activitiesRes.data?.results || activitiesRes.data || [];
        setRecentActivities(
          activitiesData.slice(0, 4).map((item) => ({
            id: item.id || Math.random().toString(36).substring(2, 9),
            text: item.action || item.message || "Activity",
            time: new Date(item.timestamp || new Date()).toLocaleTimeString(),
            icon: <NotificationsIcon color="primary" />,
          }))
        );
        setLoadingActivities(false);
      } catch (error) {
        let errorMessage = "Failed to load dashboard data";

        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("access_token");
            navigate("/admin/login");
            return;
          }
          errorMessage =
            error.response.data?.detail ||
            error.response.statusText ||
            errorMessage;
        } else if (error.request) {
          errorMessage = "No response from server. Check your connection.";
        } else {
          errorMessage = error.message || errorMessage;
        }

        setStats((prev) => ({ ...prev, loading: false, error: errorMessage }));
        setLoadingActivities(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCardClick = (path) => {
    navigate(`/admin/${path}`);
  };

  if (stats.error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Dashboard Load Error</Typography>
          <Typography>{stats.error}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try these steps:
            <ul>
              <li>Refresh the page</li>
              <li>Check your internet connection</li>
              <li>Verify the backend server is running</li>
              <li>Ensure you have proper permissions</li>
            </ul>
          </Typography>
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Refresh Page
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            localStorage.removeItem("access_token");
            navigate("/login");
          }}
        >
          Re-login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 3, backgroundColor: theme.palette.grey[50], minHeight: "100vh" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Dashboard Overview
        </Typography>
        <Chip
          icon={<NotificationsIcon />}
          label={`${stats.systemAlerts} New Alerts`}
          color="error"
          variant="outlined"
          clickable
          onClick={() => handleCardClick("notifications")}
        />
      </Box>

      {stats.loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ ml: 2, alignSelf: "center" }}>
            Loading dashboard data...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<MedicalServicesIcon fontSize="medium" />}
              title="Doctors"
              value={stats.doctors}
              color="primary"
              progress={(stats.doctors / 50) * 100}
              onClick={() => handleCardClick("doctors")}
              actionText="Manage Doctors"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PeopleIcon fontSize="medium" />}
              title="Patients"
              value={stats.patients}
              color="secondary"
              progress={(stats.patients / 200) * 100}
              onClick={() => handleCardClick("patients")}
              actionText="Manage Patients"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<EventAvailableIcon fontSize="medium" />}
              title="Today's Appointments"
              value={stats.appointmentsToday}
              color="success"
              progress={(stats.appointmentsToday / 30) * 100}
              onClick={() => handleCardClick("appointments")}
              actionText="View Schedule"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ReportIcon fontSize="medium" />}
              title="System Alerts"
              value={stats.systemAlerts}
              color="error"
              progress={Math.min(stats.systemAlerts * 10, 100)}
              onClick={() => handleCardClick("system-alerts")}
              actionText="View Alerts"
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                boxShadow: theme.shadows[2],
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  pb: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recent Activities
                </Typography>
              </Box>

              {loadingActivities ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : recentActivities.length > 0 ? (
                <>
                  <Stack spacing={3}>
                    {recentActivities.map((activity) => (
                      <Box
                        key={activity.id}
                        sx={{ display: "flex", alignItems: "flex-start" }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.grey[100],
                            color: theme.palette.text.secondary,
                            mr: 2,
                            mt: 0.5,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" fontWeight={500}>
                            {activity.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    fullWidth
                    variant="text"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 3, color: theme.palette.primary.main }}
                    onClick={() => handleCardClick("activity-logs")}
                  >
                    View All Activities
                  </Button>
                </>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No recent activities found
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                textAlign: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                boxShadow: theme.shadows[6],
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 80,
                  height: 80,
                  mb: 3,
                }}
              >
                <SettingsApplicationsIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Configuration
              </Typography>
              <Typography variant="body2" mb={3} sx={{ opacity: 0.9 }}>
                Manage all system settings, permissions and configurations
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}
                onClick={() => handleCardClick("settings")}
              >
                Go to Settings
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  color,
  progress,
  onClick,
  actionText,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: theme.shadows[4],
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[8],
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: theme.palette[color].light,
              color: theme.palette[color].main,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.grey[200],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: theme.palette[color].main,
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          sx={{ color: theme.palette[color].main }}
        >
          {actionText}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AdminHomePage;
