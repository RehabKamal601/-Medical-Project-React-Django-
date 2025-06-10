import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const PatientAppBar = ({ drawerWidth = 240, onDrawerToggle }) => {
  const [patientData, setPatientData] = useState({
    name: "Patient Name",
    image: null,
  });

  useEffect(() => {
    // محاكاة لجلب بيانات المريض (في التطبيق الحقيقي سيتم جلبها من API)
    const fetchPatientData = async () => {
      try {
        // هنا سيتم استدعاء API لجلب بيانات المريض
        // const response = await fetch('/api/patient');
        // const data = await response.json();

        // بيانات وهمية للعرض
        const mockPatientData = {
          name: "Sara Ali",
          image: "https://randomuser.me/api/portraits/women/12.jpg", // يمكن تغييرها لـ null لاختبار الحالة الثانية
        };

        setPatientData(mockPatientData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const getInitials = (name) => {
    if (!name) return "P";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`
      : names[0].charAt(0);
  };

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
          Patient Dashboard
        </Typography>
        <Avatar
          src={patientData.image}
          sx={{
            bgcolor: "primary.dark",
            color: "primary.contrastText",
            width: 40,
            height: 40,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {getInitials(patientData.name)}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default PatientAppBar;
