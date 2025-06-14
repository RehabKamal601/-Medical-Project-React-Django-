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

const API_URL = "http://127.0.0.1:8000/api/doctor";

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
  const [loading, setLoading] = useState({
    approve: false,
    block: false,
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

  const fetchDoctors = async () => {
    try {
      setLoading(prev => ({...prev, general: true}));
      const response = await axios.get(`${API_URL}/doctors/`, {
        headers: getAuthHeaders(),
      });
      setDoctors(response.data);
    } catch (error) {
      handleApiError(error, "Failed to fetch doctors");
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
    fetchDoctors();
  }, []);

  const handleApproveDoctor = async (id) => {
    try {
      setLoading(prev => ({...prev, approve: true}));
      const response = await axios.post(
        `${API_URL}/doctors/${id}/approve/`,
        {},
        { headers: getAuthHeaders() }
      );
      
      if (response.status === 200) {
        await fetchDoctors();
        setSnackbar({
          open: true,
          message: "Doctor approved successfully",
          severity: "success",
        });
      }
    } catch (error) {
      handleApiError(error, "Failed to approve doctor");
    } finally {
      setLoading(prev => ({...prev, approve: false}));
    }
  };

  const handleBlockDoctor = async (id) => {
    try {
      setLoading(prev => ({...prev, block: true}));
      const response = await axios.post(
        `${API_URL}/doctors/${id}/block/`,
        {},
        { headers: getAuthHeaders() }
      );
      
      if (response.status === 200) {
        await fetchDoctors();
        setSnackbar({
          open: true,
          message: "Doctor blocked successfully",
          severity: "success",
        });
      }
    } catch (error) {
      handleApiError(error, "Failed to block doctor");
    } finally {
      setLoading(prev => ({...prev, block: false}));
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

  const getSpecialtyName = (specialization) => {
    if (!specialization) return "Without specialization";
    return specialization;
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
                  <TableCell sx={{ color: "#fff" }}>Specialty</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.full_name}</TableCell>
                    <TableCell>{doctor.user?.email || "Not Set"}</TableCell>
                    <TableCell>{doctor.phone || "Not Set"}</TableCell>
                    <TableCell>{getSpecialtyName(doctor.specialization)}</TableCell>
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
                          disabled={loading.approve}
                          startIcon={loading.approve && <CircularProgress size={20} />}
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
                          disabled={loading.block}
                          startIcon={loading.block && <CircularProgress size={20} />}
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
                          disabled={loading.approve}
                          startIcon={loading.approve && <CircularProgress size={20} />}
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