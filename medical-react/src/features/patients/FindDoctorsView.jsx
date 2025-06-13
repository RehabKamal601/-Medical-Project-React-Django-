import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Card,
  Typography,
  InputAdornment,
  Avatar,
  CircularProgress,
  Stack,
  MenuItem,
  Button,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const FindDoctorsView = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth();

  const specializations = [
    "General", "Lungs Specialist", "Dentist", "Psychiatrist",
    "Covid-19", "Surgeon", "Cardiologist"
  ];

  const ratingOptions = ["5", "4.5", "4", "3.5"];

  const getToken = () =>
    (user && (user.access || user.token)) ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    null;

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthError("You are not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    axios.get("http://localhost:8000/api/doctor/all-doctors/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setDoctors(res.data);
      setFilteredDoctors(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      setAuthError("Error fetching doctors. Please try again later.");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doc) => {
      const nameMatch = doc.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const specMatch = !selectedSpecialization || 
        doc.specialization?.toLowerCase() === selectedSpecialization.toLowerCase();
      const ratingMatch = !selectedRating || 
        parseFloat(doc.rating || 0) >= parseFloat(selectedRating);
      return nameMatch && specMatch && ratingMatch;
    });
    setFilteredDoctors(filtered);
    setPage(1);
  }, [searchTerm, selectedSpecialization, selectedRating, doctors]);

  const currentDoctors = filteredDoctors.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(filteredDoctors.length / itemsPerPage);

  const recommendedDoctors = doctors
    .filter((doc) => parseFloat(doc.rating || 0) > 4.5)
    .filter((doc) => !currentDoctors.some((d) => d.id === doc.id))
    .slice(0, 5);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpecialization("");
    setSelectedRating("");
  };

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (authError) return <Box p={3}><Typography color="error">{authError}</Typography></Box>;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>Find Doctors</Typography>

      {/* Filters Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchIcon /></InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Specialize"
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {specializations.map((spec) => (
            <MenuItem key={spec} value={spec}>{spec}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Rating"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {ratingOptions.map((rate) => (
            <MenuItem key={rate} value={rate}>≥ {rate}</MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" color="secondary" onClick={resetFilters}>
          Reset
        </Button>
      </Stack>

      {/* All Doctors */}
      <Typography variant="h6" fontWeight={600} mb={2}>All Doctors</Typography>
      <Grid container spacing={2}>
        {currentDoctors.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Link to={`/patient/doctors/${doc.id}`}>

            <Card sx={{ p: 2, textAlign: "center" }}>
              <Avatar
                src={doc.image || ""}
                alt={doc.full_name}
                sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
              />
              <Typography variant="subtitle1" fontWeight={600}>{doc.full_name}</Typography>
              <Typography variant="body2" color="text.secondary">{doc.specialization || "No Specialty"}</Typography>
              <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
                <StarIcon fontSize="small" />
                <Typography variant="caption">{doc.rating || "N/A"}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="center" spacing={1}>
                <LocationOnIcon fontSize="small" color="disabled" />
                <Typography variant="caption">{doc.address || "Unknown"}</Typography>
              </Stack>
            </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pageCount > 1 && (
        <Stack direction="row" justifyContent="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </Stack>
      )}

      {/* Recommended Doctors */}
      {recommendedDoctors.length > 0 && (
        <>
          <hr style={{ margin: "40px 0" }} />
          <Typography variant="h6" fontWeight={600} mb={2}>Recommended Doctors (Rating ≥ 4.5)</Typography>
          <Grid container spacing={2}>
            {recommendedDoctors.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Link to={`/patient/doctors/${doc.id}`} style={{ textDecoration: "none" }}>
                  <Card sx={{ p: 2, textAlign: "center" }}>
                    <Avatar
                      src={doc.image || ""}
                      alt={doc.full_name}
                      sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
                    />
                    <Typography variant="subtitle1" fontWeight={600}>{doc.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{doc.specialization}</Typography>
                    <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
                      <StarIcon fontSize="small" />
                      <Typography variant="caption">{doc.rating}</Typography>
                    </Stack>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default FindDoctorsView;
