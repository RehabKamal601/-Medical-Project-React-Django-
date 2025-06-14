import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      const response = await fetch("http://127.0.0.1:8000/api/patients/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expired. Please login again.",
            severity: "error",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      setError(error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      const response = await fetch(
        `http://127.0.0.1:8000/api/patients/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expired. Please login again.",
            severity: "error",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch patient");
      }

      const data = await response.json();
      setPatient(data);
      setForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        address: data.address,
      });
    } catch (error) {
      setError(error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleStatusChange = async (field, value) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://127.0.0.1:8000/api/patients/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patient status");
      }

      const updatedPatient = await response.json();
      setPatient(updatedPatient);
      setSnackbar({
        open: true,
        message: `Patient ${field.replace("_", " ")} updated successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleOpenEdit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://127.0.0.1:8000/api/patients/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      const updatedPatient = await response.json();
      setPatient(updatedPatient);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Patient updated successfully",
        severity: "success",
      });
      fetchPatients();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "P";
    try {
      const names = name.split(" ").filter(Boolean);
      return names
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    } catch {
      return "P";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPatients = patients.filter((patient) => {
    const patientName = patient?.name || '';
    const searchTermLower = searchTerm.toLowerCase();
    return patientName.toLowerCase().includes(searchTermLower);
  });

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredPatients.length - page * rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !patient && !patients.length) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5F8FF", minHeight: "100vh", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "24px", mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: "#199A8E", fontWeight: "bold" }}
        >
          {id ? "Patient Details" : "Patients List"}
        </Typography>

        {id ? (
          patient ? (
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      sx={{
                        width: 150,
                        height: 150,
                        bgcolor: "#199A8E",
                        fontSize: 60,
                      }}
                    >
                      {getInitials(patient.full_name)}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h4" gutterBottom>
                        {patient.full_name || "Unknown Patient"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PersonIcon /> Personal Information
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Email"
                              secondary={patient.email || "N/A"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Phone"
                              secondary={patient.phone || "N/A"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Date of Birth"
                              secondary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <EventIcon fontSize="small" />
                                  {formatDate(patient.date_of_birth)}
                                </Box>
                              }
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Address"
                              secondary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <LocationOnIcon fontSize="small" />
                                  {patient.address || "N/A"}
                                </Box>
                              }
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="error" sx={{ mb: 3 }}>
              Patient data could not be loaded
            </Alert>
          )
        ) : (
          <>
            <TextField
              label="Search Patients"
              variant="outlined"
              size="small"
              sx={{ mb: 3, width: "100%", maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>
                          {formatDate(patient.date_of_birth)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() =>
                              navigate(`/admin/patients/${patient.id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPatients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {id ? (
            <>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleOpenEdit}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/patients")}
              >
                Back to Patients List
              </Button>
            </>
          ) : (
            <Button variant="outlined" onClick={() => navigate("/admin")}>
              Back to Dashboard
            </Button>
          )}
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name || "At least 3 characters"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email *"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email || "e.g., user@example.com"}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone *"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone || "10-15 digits only"}
            fullWidth
            margin="normal"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 15,
            }}
          />
          <TextField
            label="Date of Birth *"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
            error={!!errors.date_of_birth}
            helperText={errors.date_of_birth}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Address *"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address || "At least 10 characters"}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientDetails;