import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  CalendarToday as AppointmentsIcon,
  Person as ProfileIcon,
  Chat as MessagesIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";

const PatientSidebar = ({ drawerWidth = 240, mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/patient" },
    { text: "Appointments", icon: <AppointmentsIcon />, path: "/patient/my-appointments" },
    { text: "Profile", icon: <ProfileIcon />, path: "/patient/profile" },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="primary"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Medics
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={NavLink}
              to={item.path}
              sx={{
                color: "text.primary",
                "&.active": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: "bold",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                  borderRadius: 1,
                },
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                  borderRadius: 1,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default PatientSidebar;
