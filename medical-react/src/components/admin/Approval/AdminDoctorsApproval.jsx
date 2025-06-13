import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Button,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";

const API_URL = "http://127.0.0.1:8000/api/admin";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

export default function AdminDoctorApproval() {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/doctors/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to fetch doctors",
          severity: "error",
        });
      }
    }
  };

  const handleUnauthorized = () => {
    setSnackbar({
      open: true,
      message: "Session expired. Please login again.",
      severity: "error",
    });
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApproveDoctor = async (id) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${API_URL}/doctors/${id}/approve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDoctors();
      setSnackbar({
        open: true,
        message: "Doctor approved successfully",
        severity: "success",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to approve doctor",
          severity: "error",
        });
      }
    }
  };

  const handleBlockDoctor = async (id) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${API_URL}/doctors/${id}/block/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDoctors();
      setSnackbar({
        open: true,
        message: "Doctor blocked successfully",
        severity: "success",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to block doctor",
          severity: "error",
        });
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDoctors = doctors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(doctors.length / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ backgroundColor: "#F5F8FF", minHeight: "100vh", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "24px" }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 3,
            color: "#199A8E",
            fontWeight: "bold",
          }}
        >
          Approve / Block Doctors
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Specialty</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>
                  {doctor.specialty?.name || "Without Specialty"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      doctor.is_blocked
                        ? "Blocked"
                        : doctor.is_approved
                        ? "Approved"
                        : "Pending"
                    }
                    color={
                      doctor.is_blocked
                        ? "error"
                        : doctor.is_approved
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  {!doctor.is_approved && !doctor.is_blocked && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApproveDoctor(doctor.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                  )}
                  {!doctor.is_blocked && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleBlockDoctor(doctor.id)}
                    >
                      Block
                    </Button>
                  )}
                  {doctor.is_blocked && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleApproveDoctor(doctor.id)}
                    >
                      Unblock
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
