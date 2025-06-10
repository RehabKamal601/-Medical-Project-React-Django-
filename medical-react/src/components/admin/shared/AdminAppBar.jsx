import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const AdminAppBar = ({ drawerWidth = 240, onDrawerToggle }) => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/1");
        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: "primary.main",
        boxShadow: 3,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Avatar sx={{ bgcolor: "primary.dark" }}>A</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
