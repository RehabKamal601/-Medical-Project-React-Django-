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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../CustomPagination.jsx";

const API_URL = "http://localhost:5000";

export default function AdminDoctorApproval() {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  const navigate = useNavigate();

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDoctors = doctors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(doctors.length / pageSize);

  const toggleApproval = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/doctors/${id}`, {
        approved: !currentStatus,
      });
      fetchDoctors();
    } catch (err) {
      console.error("Error updating approval", err);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
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
                <TableCell sx={{ color: "#fff" }}>Full Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.fullName}</TableCell>
                  <TableCell>{doctor.email || doctor.contact}</TableCell>
                  <TableCell>{doctor.phone || doctor.contact}</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.approved ? "Approved" : "Blocked"}
                      color={doctor.approved ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => toggleApproval(doctor.id, doctor.approved)}
                      sx={{
                        backgroundColor: doctor.approved
                          ? "#FF4D4D"
                          : "#199A8E",
                        "&:hover": {
                          backgroundColor: doctor.approved
                            ? "#d13232"
                            : "#157f76",
                        },
                      }}
                    >
                      {doctor.approved ? "Block" : "Approve"}
                    </Button>
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
      </Box>
    </>
  );
}
