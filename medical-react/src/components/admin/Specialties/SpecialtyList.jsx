import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPagination from "../../CustomPagination.jsx";

const SpecialtiesList = () => {
  const [specialties, setSpecialties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const specialtiesPerPage = 5;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Specialty name is required";
    else if (name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSpecialties = async () => {
    try {
      const response = await fetch("http://localhost:5000/specialties");
      setSpecialties(await response.json());
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load specialties",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenAdd = () => {
    setEditingSpecialty(null);
    setName("");
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenEdit = (specialty) => {
    setEditingSpecialty(specialty);
    setName(specialty.name);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const url = editingSpecialty
        ? `http://localhost:5000/specialties/${editingSpecialty.id}`
        : "http://localhost:5000/specialties";
      const method = editingSpecialty ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to save specialty");

      fetchSpecialties();
      setOpenDialog(false);
      showSnackbar(
        editingSpecialty
          ? "Specialty updated successfully"
          : "Specialty added successfully"
      );
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleDelete = (specialty) => {
    setSelectedSpecialty(specialty);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/specialties/${selectedSpecialty.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      fetchSpecialties();
      setOpenConfirmDialog(false);
      showSnackbar("Specialty deleted successfully");
    } catch (error) {
      showSnackbar(error.message, "error");
      setOpenConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const indexOfLastSpecialty = currentPage * specialtiesPerPage;
  const indexOfFirstSpecialty = indexOfLastSpecialty - specialtiesPerPage;
  const currentSpecialties = specialties.slice(
    indexOfFirstSpecialty,
    indexOfLastSpecialty
  );
  const totalPages = Math.ceil(specialties.length / specialtiesPerPage);

  return (
    <Box sx={{ backgroundColor: "#F5F8FF", minHeight: "100vh", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "24px" }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: "#199A8E", fontWeight: "bold" }}
        >
          Specialties Management
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add New Specialty
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#199A8E" }}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSpecialties.map((specialty) => (
              <TableRow key={specialty.id}>
                <TableCell>#{specialty.id}</TableCell>
                <TableCell>{specialty.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(specialty)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(specialty)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSpecialty ? "Edit Specialty" : "Add Specialty"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Specialty Name *"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name || "At least 3 characters"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingSpecialty ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedSpecialty?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default SpecialtiesList;
