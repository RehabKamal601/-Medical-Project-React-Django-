import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import AdminAppBar from "./AdminAppBar";
import AdminSidebar from "./AdminSidebar";

const drawerWidth = 240;

function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <AdminAppBar
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
      />
      <AdminSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;
