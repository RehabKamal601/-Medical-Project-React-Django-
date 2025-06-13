import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DoctorProtectedRoute = () => {
  const { user } = useAuth();
  if (!user || user.role !== "doctor") {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default DoctorProtectedRoute;
