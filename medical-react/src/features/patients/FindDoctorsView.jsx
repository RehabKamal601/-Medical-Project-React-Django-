import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Avatar,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { Link } from "react-router-dom";

const FindDoctorsView = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const categories = [
    "General",
    "Lungs Specialist",
    "Dentist",
    "Psychiatrist",
    "Covid-19",
    "Surgeon",
    "Cardiologist",
  ];
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/doctors")
      .then((res) => {
        console.log(res.data); // <-- check this
        setDoctors(res.data);
        setFilteredDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doc) => {
      const nameMatch = doc.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        !selectedCategory ||
        doc.specialty?.toLowerCase() === selectedCategory.toLowerCase();
      return nameMatch && categoryMatch;
    });
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedCategory, doctors]);

  if (loading)
    return (
      <Box p={3}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant='h5' fontWeight={600} mb={2}>
        Find Doctors
      </Typography>
      <TextField
        fullWidth
        variant='outlined'
        placeholder='Find a doctor'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, borderRadius: 2 }}
      />

      <Typography variant='subtitle1' fontWeight={500} mb={1}>
        Category
      </Typography>
      <Stack direction='row' spacing={1} mb={3} flexWrap='wrap'>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            color={selectedCategory === cat ? "primary" : "default"}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? "" : cat)
            }
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      <Typography variant='subtitle1' fontWeight={600} mb={2}>
        Recommended Doctors
      </Typography>
      <Grid container spacing={2} mb={4}>
        {filteredDoctors.length === 0 ? (
          <Typography variant='body2' color='text.secondary'>
            No doctors found.
          </Typography>
        ) : (
          filteredDoctors.slice(0, 1).map((doc) => (
            <Grid item xs={12} key={doc.id}>
              <Link
                to={`/patient/doctors/${doc.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                  <Avatar
                    src={doc.image}
                    alt={doc.fullName}
                    sx={{ width: 64, height: 64, mr: 2 }}
                  />
                  <Box>
                    <Typography variant='subtitle1' fontWeight={600}>
                      {doc.fullName}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom
                    >
                      {doc.specialty}
                    </Typography>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <Chip
                        icon={<StarIcon fontSize='small' />}
                        label={doc.rating || "4.7"}
                        size='small'
                        color='success'
                      />
                      <Stack direction='row' alignItems='center' spacing={0.5}>
                        <LocationOnIcon color='disabled' fontSize='small' />
                        <Typography variant='caption' color='text.secondary'>
                          {doc.distance || "800m away"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))
        )}
      </Grid>

      <Typography variant='subtitle1' fontWeight={600} mb={2}>
        Your Recent Doctors
      </Typography>
      <Stack direction='row' spacing={2}>
        {doctors.slice(0, 4).map((doc) => (
          <Box key={doc.id} textAlign='center'>
            <Avatar src={doc.image} alt={doc.fullName} sx={{ mx: "auto" }} />
            <Typography variant='caption'>
              {doc.fullName.split(" ")[0]}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default FindDoctorsView;
