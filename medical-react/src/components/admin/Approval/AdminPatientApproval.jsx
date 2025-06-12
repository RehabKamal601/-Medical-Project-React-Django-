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

export default function AdminPatientApproval() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/patients/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to fetch patients",
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
    fetchPatients();
  }, []);

  const handleApprovePatient = async (id) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${API_URL}/patients/${id}/approve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPatients();
      setSnackbar({
        open: true,
        message: "Patient approved successfully",
        severity: "success",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to approve patient",
          severity: "error",
        });
      }
    }
  };

  const handleBlockPatient = async (id) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${API_URL}/patients/${id}/block/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPatients();
      setSnackbar({
        open: true,
        message: "Patient blocked successfully",
        severity: "success",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to block patient",
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
  const paginatedPatients = patients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(patients.length / pageSize);

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
          Approve / Block Patients
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date of Birth</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.date_of_birth || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      patient.is_blocked
                        ? "Blocked"
                        : patient.is_approved
                        ? "Approved"
                        : "Pending"
                    }
                    color={
                      patient.is_blocked
                        ? "error"
                        : patient.is_approved
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  {!patient.is_approved && !patient.is_blocked && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprovePatient(patient.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                  )}
                  {!patient.is_blocked && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleBlockPatient(patient.id)}
                    >
                      Block
                    </Button>
                  )}
                  {patient.is_blocked && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleApprovePatient(patient.id)}
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
