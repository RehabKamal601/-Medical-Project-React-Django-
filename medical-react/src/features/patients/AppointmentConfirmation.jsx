import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { CalendarMonth, Edit, LocalHospital } from "@mui/icons-material";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";

const AppointmentConfirmation = () => {
  const { docId } = useParams();

  const { user } = useUser();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    "Wednesday, Jun 23, 2021 | 10:00 AM"
  );
  const [reason, setReason] = useState("Chest pain");
  const [paymentMethod, setPaymentMethod] = useState("VISA");

  const [openDateModal, setOpenDateModal] = useState(false);
  const [openReasonModal, setOpenReasonModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${docId}`);
        console.log(res.data);
        setDoctor(res.data);
        console.log(res.data.name);
        console.log(res.data.fullname);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const handleBook = async () => {
    const payload = {
      patientId: user.id,
      doctorName: doctor.fullName,
      specialty: doctor.specialty,
      date: selectedDate.split(" | ")[0],
      time: selectedDate.split(" | ")[1],
      reason,
      status: "pending",
      paymentMethod,
    };

    try {
      await axios.post("http://localhost:5000/appointments", payload);
      console.log("Appointment booked!");
    } catch (err) {
      console.error("Failed to book appointment.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Appointment
        </Typography>

        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <Avatar
            src={doctor.image}
            sx={{ width: 56, height: 56, marginRight: 2 }}
          />
          <div>
            <Typography variant='subtitle1'>{doctor.fullName}</Typography>
            <Typography variant='body2'>{doctor.specialty}</Typography>
            <Typography variant='body2'>
              ⭐ {doctor.rating} — {doctor.distance} away
            </Typography>
          </div>
        </div>

        <Divider />

        {/* Date Section */}
        <div style={{ marginTop: 16 }}>
          <Typography variant='subtitle2'>Date</Typography>
          <Typography
            variant='body2'
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              <CalendarMonth fontSize='small' /> {selectedDate}
            </span>
            <Button size='small' onClick={() => setOpenDateModal(true)}>
              Change
            </Button>
          </Typography>
        </div>

        {/* Reason Section */}
        <div style={{ marginTop: 16 }}>
          <Typography variant='subtitle2'>Reason</Typography>
          <Typography
            variant='body2'
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              <LocalHospital fontSize='small' /> {reason}
            </span>
            <Button size='small' onClick={() => setOpenReasonModal(true)}>
              Change
            </Button>
          </Typography>
        </div>

        <Divider sx={{ my: 2 }} />

        {/* Payment */}
        <Typography variant='subtitle2'>Payment Detail</Typography>
        <Typography variant='body2'>Consultation: $60.00</Typography>
        <Typography variant='body2'>Admin Fee: $01.00</Typography>
        <Typography variant='body2'>
          Total: <strong style={{ color: "#0a9" }}>$61.00</strong>
        </Typography>

        {/* Payment Method */}
        <Typography variant='subtitle2' sx={{ mt: 2 }}>
          Payment Method
        </Typography>
        <Typography
          variant='body2'
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {paymentMethod}
          <Button size='small' onClick={() => setOpenPaymentModal(true)}>
            Change
          </Button>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Button variant='contained' fullWidth onClick={handleBook}>
          Booking
        </Button>
      </CardContent>

      {/* Date Modal */}
      <Dialog open={openDateModal} onClose={() => setOpenDateModal(false)}>
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          {/* Replace this with a real calendar if you want */}
          <Button
            onClick={() => setSelectedDate("Friday, Jul 12, 2021 | 11:00 AM")}
          >
            Friday, Jul 12, 2021 | 11:00 AM
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDateModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reason Modal */}
      <Dialog open={openReasonModal} onClose={() => setOpenReasonModal(false)}>
        <DialogTitle>Change Reason</DialogTitle>
        <DialogContent>
          <Button onClick={() => setReason("Headache")}>Headache</Button>
          <Button onClick={() => setReason("Back pain")}>Back pain</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReasonModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <Dialog
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      >
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          <Button onClick={() => setPaymentMethod("VISA")}>VISA</Button>
          <Button onClick={() => setPaymentMethod("Mastercard")}>
            Mastercard
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AppointmentConfirmation;
