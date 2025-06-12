import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email as EmailIcon,
  CheckCircle as ConfirmedIcon,
  Schedule as PendingIcon,
  Cancel as RejectedIcon,
  CalendarToday as AppointmentIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../components/CustomPagination.jsx";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/notifications/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/admin/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      const processedNotifications = data.map((notification) => {
        if (notification.type === "booking_confirmation") {
          return {
            ...notification,
            message: `Booking confirmed with Dr. ${notification.doctor_name} on ${notification.date} at ${notification.time}`,
          };
        } else if (notification.type === "booking_pending") {
          return {
            ...notification,
            message: `Booking request sent to Dr. ${notification.doctor_name} for ${notification.date}`,
          };
        } else if (notification.type === "booking_rejected") {
          return {
            ...notification,
            message: `Booking rejected by Dr. ${notification.doctor_name} for ${notification.date}`,
          };
        } else if (notification.type === "appointment_reminder") {
          return {
            ...notification,
            message: `Reminder: Appointment with Dr. ${notification.doctor_name} tomorrow at ${notification.time}`,
          };
        }
        return notification;
      });

      setNotifications(processedNotifications);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/notifications/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "error",
        });
        navigate("/admin/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to delete notification");

      fetchNotifications();
      setSnackbar({
        open: true,
        message: "Notification deleted successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmation":
        return <ConfirmedIcon />;
      case "booking_pending":
        return <PendingIcon />;
      case "booking_rejected":
        return <RejectedIcon />;
      case "appointment_reminder":
        return <AppointmentIcon />;
      default:
        return <EmailIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "booking_confirmation":
        return "success";
      case "booking_pending":
        return "warning";
      case "booking_rejected":
        return "error";
      case "appointment_reminder":
        return "info";
      default:
        return "primary";
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Typography>
    );

  return (
    <>
      <Paper
        sx={{
          p: 3,
          maxWidth: 650,
          mx: "auto",
          mt: 4,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 2, fontWeight: "bold" }}
          color="primary"
          textAlign="center"
        >
          Notifications
        </Typography>

        <List>
          {currentNotifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{ py: 2 }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getNotificationColor(
                        notification.type
                      )}.main`,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {notification.message}
                      </Typography>
                      {notification.type && (
                        <Chip
                          label={notification.type.replace(/_/g, " ")}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                          color={getNotificationColor(notification.type)}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>
                      {notification.notes && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Notes: {notification.notes}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>

        {notifications.length > itemsPerPage && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Box>
        )}
      </Paper>

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
    </>
  );
};

export default Notifications;
