import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PatientProtectedRoute = () => {
  const { user } = useAuth();
  if (!user || user.role !== "patient") {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default PatientProtectedRoute;
