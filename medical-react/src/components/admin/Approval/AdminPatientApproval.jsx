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
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";

const API_URL = "http://127.0.0.1:8000/api/patients";

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
  const [loading, setLoading] = useState({
    approve: false,
    block: false,
    unblock: false,
    general: false,
  });
  const pageSize = 5;
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchPatients = async () => {
    try {
      setLoading(prev => ({...prev, general: true}));
      const response = await axios.get(`${API_URL}/`, {
        headers: getAuthHeaders(),
      });
      setPatients(response.data);
    } catch (error) {
      handleApiError(error, "Failed to fetch patients");
    } finally {
      setLoading(prev => ({...prev, general: false}));
    }
  };

  const handleApiError = (error, defaultMessage) => {
    console.error("API Error:", error);
    
    let errorMessage = defaultMessage;
    if (error.response) {
      if (error.response.status === 403) {
        errorMessage = "Permission denied. Check your admin privileges.";
      } else if (error.response.data?.detail) {
        errorMessage = error.response.data.detail;
      }
    }

    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error",
    });

    if (error.response?.status === 401) {
      handleUnauthorized();
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("access_token");
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleApprovePatient = async (id) => {
    try {
      setLoading(prev => ({...prev, approve: true}));
      const response = await axios.post(
        `${API_URL}/${id}/approve/`,
        {},
        { headers: getAuthHeaders() }
      );
      
      if (response.status === 200) {
        await fetchPatients();
        setSnackbar({
          open: true,
          message: "Patient approved successfully",
          severity: "success",
        });
      }
    } catch (error) {
      handleApiError(error, "Failed to approve patient");
    } finally {
      setLoading(prev => ({...prev, approve: false}));
    }
  };

  const handleBlockPatient = async (id) => {
    try {
      setLoading(prev => ({...prev, block: true}));
      const response = await axios.post(
        `${API_URL}/${id}/block/`,
        {},
        { headers: getAuthHeaders() }
      );
      
      if (response.status === 200) {
        await fetchPatients();
        setSnackbar({
          open: true,
          message: "Patient blocked successfully",
          severity: "success",
        });
      }
    } catch (error) {
      handleApiError(error, "Failed to block patient");
    } finally {
      setLoading(prev => ({...prev, block: false}));
    }
  };

  const handleUnblockPatient = async (id) => {
    try {
      setLoading(prev => ({...prev, unblock: true}));
      const response = await axios.post(
        `${API_URL}/${id}/unblock/`,
        {},
        { headers: getAuthHeaders() }
      );
      
      if (response.status === 200) {
        await fetchPatients();
        setSnackbar({
          open: true,
          message: "Patient unblocked successfully",
          severity: "success",
        });
      }
    } catch (error) {
      handleApiError(error, "Failed to unblock patient");
    } finally {
      setLoading(prev => ({...prev, unblock: false}));
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

        {loading.general ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                    <TableCell>{patient.full_name}</TableCell>
                    <TableCell>{patient.email || "Not Set"}</TableCell>
                    <TableCell>{patient.phone || "Not Set"}</TableCell>
                    <TableCell>{patient.date_of_birth || "Not Set"}</TableCell>
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
                          disabled={loading.approve}
                          startIcon={loading.approve && <CircularProgress size={20} />}
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
                          disabled={loading.block}
                          startIcon={loading.block && <CircularProgress size={20} />}
                        >
                          Block
                        </Button>
                      )}
                      {patient.is_blocked && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleUnblockPatient(patient.id)}
                          disabled={loading.unblock}
                          startIcon={loading.unblock && <CircularProgress size={20} />}
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
          </>
        )}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}