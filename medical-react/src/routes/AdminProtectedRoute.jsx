import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminProtectedRoute = () => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default AdminProtectedRoute;
