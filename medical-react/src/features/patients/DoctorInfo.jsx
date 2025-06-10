import React, { useEffect, useState } from "react";
import DoctorDetailCard from "../../components/DoctorDetailCard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

const DoctorInfo = () => {
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("23");
  const [selectedTime, setSelectedTime] = useState("02:00 PM");
  const { docId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!docId) return;

    axios
      .get(`http://localhost:5000/doctors/${docId}`)
      .then((res) => {
        setDoctor(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctor details:", err);
        setLoading(false);
      });
  }, [docId]);

  const handleBook = () => {
    navigate(`/patient/confirm-appointment/${docId}`);
  };

  if (loading)
    return (
      <Box display='flex' justifyContent='center' alignItems='center' p={3}>
        <CircularProgress />
      </Box>
    );

  return (
    console.log(doctor),
    (
      <DoctorDetailCard
        doctor={doctor}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedTime={selectedTime}
        onTimeChange={setSelectedTime}
        onBook={handleBook}
      />
    )
  );
};

export default DoctorInfo;
