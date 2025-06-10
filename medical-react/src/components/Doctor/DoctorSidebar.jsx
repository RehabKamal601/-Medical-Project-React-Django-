import React from "react";
import { Link } from "react-router-dom";
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

const DoctorSidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor/dashboard" },
    { text: "Availability", icon: <AvailabilityIcon />, path: "/doctor/availability" },
    { text: "Appointments", icon: <CalendarTodayIcon />, path: "/doctor/appointments" },
    { text: "Schedule", icon: <ScheduleIcon />, path: "/doctor/schedule" },
    { text: "Patients", icon: <PatientsIcon />, path: "/doctor/patients" } ,

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
          alt="Doctor"
          src="/doctor-avatar.jpg"
          sx={styles.avatar}
        />
        <Typography variant="h6" sx={styles.doctorName}>
          Dr. Rehab Ali
        </Typography>
        <Typography variant="caption" sx={styles.specialty}>
          Cardiologist
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
          component={Link}
          to="/logout"
        >
          <ListItemIcon sx={styles.listIcon}>
            <LogoutIcon />
          </ListItemIcon>
          <WhiteLinkText 
            primary="Logout" 
            primaryTypographyProps={styles.listItemText}
          />
        </StyledListItem>
      </Box>
    </Drawer>
  );
};

export default DoctorSidebar;