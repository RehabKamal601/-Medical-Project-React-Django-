import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemIcon,
  Divider,
  Avatar,
  Box,
  Typography
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AccessTime as AvailabilityIcon,
  Schedule as ScheduleIcon,
  ExitToApp as LogoutIcon,
  PeopleAlt as PatientsIcon
} from "@mui/icons-material";
import { styles, StyledListItem, WhiteLinkText } from "../doctorStyle/DoctorSidebar.styles";
import { useAuth } from "../../hooks/useAuth";

const DoctorSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor/dashboard" },
    { text: "Availability", icon: <AvailabilityIcon />, path: "/doctor/availability" },
    { text: "Appointments", icon: <CalendarTodayIcon />, path: "/doctor/appointments" },
    { text: "Schedule", icon: <ScheduleIcon />, path: "/doctor/schedule" },
    { text: "Patients", icon: <PatientsIcon />, path: "/doctor/patients" },
    { text: "Profile", icon: <PersonIcon />, path: "/doctor/profile" }
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={styles.drawer}
    >
      <Box sx={styles.profileContainer}>
        <Avatar
          alt={user?.username || "Doctor"}
          src={user?.image || "/doctor-avatar.jpg"}
          sx={styles.avatar}
        />
        <Typography variant="h6" sx={styles.doctorName}>
          {user ? (user.first_name && user.last_name 
            ? `Dr. ${user.first_name} ${user.last_name}`
            : `Dr. ${user.username}`
          ) : "Doctor"}
        </Typography>
        <Typography variant="caption" sx={styles.specialty}>
          {user?.specialization || "Doctor"}
        </Typography>
      </Box>

      <Divider sx={styles.divider} />

      <Box sx={styles.listContainer}>
        <List>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.text}
              button
              component={Link}
              to={item.path}
            >
              <ListItemIcon sx={styles.listIcon}>
                {item.icon}
              </ListItemIcon>
              <WhiteLinkText 
                primary={item.text} 
                primaryTypographyProps={styles.listItemText}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>

      <Box sx={styles.footerContainer}>
        <Divider sx={styles.footerDivider} />
        <StyledListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'error.dark',
            },
            backgroundColor: 'error.main',
          }}
        >
          <ListItemIcon sx={{ ...styles.listIcon, color: 'white' }}>
            <LogoutIcon />
          </ListItemIcon>
          <WhiteLinkText 
            primary="Logout" 
            primaryTypographyProps={{ ...styles.listItemText, color: 'white' }}
          />
        </StyledListItem>
      </Box>
    </Drawer>
  );
};

export default DoctorSidebar;