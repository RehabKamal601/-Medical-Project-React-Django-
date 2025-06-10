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
} from "@mui/material";
import {
    Email as EmailIcon,
    CheckCircle as ConfirmedIcon,
    Schedule as PendingIcon,
    Cancel as RejectedIcon,
    CalendarToday as AppointmentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../components/CustomPagination.jsx";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/notifications")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch notifications");
                return res.json();
            })
            .then((data) => {
                const processedNotifications = data.map((notification) => {
                    if (notification.status === "approved") {
                        return {
                            ...notification,
                            type: "booking_confirmation",
                            message: `Booking confirmed with Dr. ${notification.doctorId} on ${notification.date} at ${notification.time}`,
                        };
                    } else if (notification.status === "pending") {
                        return {
                            ...notification,
                            type: "booking_pending",
                            message: `Booking request sent to Dr. ${notification.doctorId} for ${notification.date}`,
                        };
                    } else if (notification.status === "rejected") {
                        return {
                            ...notification,
                            type: "booking_rejected",
                            message: `Booking rejected by Dr. ${notification.doctorId} for ${notification.date}`,
                        };
                    }
                    return notification;
                });

                setNotifications(processedNotifications);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {notification.message}
                        </Typography>
                        {notification.type && (
                          <Chip
                            label={notification.type.replace("_", " ")}
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        {notification.email && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Email: {notification.email}
                          </Typography>
                        )}
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

          {/* Pagination */}
          {notifications.length > itemsPerPage && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <CustomPagination
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Box>
          )}
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/doctors")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </>
    );
};

export default Notifications;
