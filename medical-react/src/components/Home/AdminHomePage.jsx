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
    useTheme
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
    VerifiedUser as VerifiedUserIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Notifications from "../../pages/admin/Notifications";

const AdminHomePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        doctors: 23,
        patients: 154,
        appointmentsToday: 12,
        systemAlerts: 3,
    });

    const [recentActivities, setRecentActivities] = useState([
        { id: 1, text: "Doctor Ahmed Ali added new specialty.", time: "10 mins ago", icon: <MedicalServicesIcon color="primary" /> },
        { id: 2, text: "Patient Sara Mohamed updated profile.", time: "25 mins ago", icon: <PeopleIcon color="secondary" /> },
        { id: 3, text: "Appointment booked for Dr. Omar at 2025-06-01 10:00 AM.", time: "1 hour ago", icon: <CalendarMonthIcon color="success" /> },
        { id: 4, text: "System backup completed successfully.", time: "2 hours ago", icon: <VerifiedUserIcon color="info" /> },
    ]);

    useEffect(() => {
        // fetch data from API here if available
    }, []);

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: theme.palette.grey[50],
                minHeight: "100vh",
                backgroundImage:
                    "linear-gradient(to bottom, #f5f7fa 0%, #e4e8ed 100%)",
            }}
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
                    onClick={() => navigate("/admin/notifications")} // Changed to navigate to notifications page
                />
            </Box>

            <Grid container spacing={3}>
                {/* Stats cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            height: "100%",
                            boxShadow: theme.shadows[4],
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: theme.shadows[8],
                            },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.light,
                                        color: theme.palette.primary.main,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <MedicalServicesIcon fontSize="medium" />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Doctors
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.doctors}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={70}
                                        sx={{
                                            mt: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: theme.palette.grey[200],
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                        <CardActions
                            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                        >
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ color: theme.palette.primary.main }}
                                onClick={() => navigate("/admin/doctors")}
                            >
                                Manage Doctors
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            height: "100%",
                            boxShadow: theme.shadows[4],
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: theme.shadows[8],
                            },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.secondary.light,
                                        color: theme.palette.secondary.main,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <PeopleIcon fontSize="medium" />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Patients
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.patients}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={85}
                                        sx={{
                                            mt: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: theme.palette.grey[200],
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: theme.palette.secondary.main,
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                        <CardActions
                            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                        >
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ color: theme.palette.secondary.main }}
                                onClick={() => navigate("/admin/patients")}
                            >
                                Manage Patients
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            height: "100%",
                            boxShadow: theme.shadows[4],
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: theme.shadows[8],
                            },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.success.light,
                                        color: theme.palette.success.main,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <EventAvailableIcon fontSize="medium" />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Appointments
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.appointmentsToday}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={60}
                                        sx={{
                                            mt: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: theme.palette.grey[200],
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: theme.palette.success.main,
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                        <CardActions
                            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                        >
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ color: theme.palette.success.main }}
                                onClick={() => navigate("/admin/appointments")}
                            >
                                View Schedule
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            height: "100%",
                            boxShadow: theme.shadows[4],
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: theme.shadows[8],
                            },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.error.light,
                                        color: theme.palette.error.main,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <ReportIcon fontSize="medium" />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        System Alerts
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.systemAlerts}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={30}
                                        sx={{
                                            mt: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: theme.palette.grey[200],
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: theme.palette.error.main,
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                        <CardActions
                            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                        >
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ color: theme.palette.error.main }}
                                onClick={() => navigate("/admin/appointments")}
                            >
                                View Alerts
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            boxShadow: theme.shadows[2],
                            borderRadius: 2,
                            background: "white",
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
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
                            onClick={() => navigate("/admin/appointments")}
                        >
                            View All Activities
                        </Button>
                    </Paper>
                </Grid>

                {/* System Settings Shortcut */}
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
                            Manage all system settings, permissions and configurations in
                            one place.
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
                                "&:hover": {
                                    boxShadow: theme.shadows[8],
                                },
                            }}
                            onClick={() => navigate("/admin/specialties")}
                        >
                            Go to Settings
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminHomePage;