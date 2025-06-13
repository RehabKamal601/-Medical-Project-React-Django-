// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Button,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import { format } from 'date-fns';

// const AppointmentConfirmation = () => {
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedReservation, setSelectedReservation] = useState(null);
//   const [newDate, setNewDate] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const patientId = localStorage.getItem('patientId');

//   const fetchReservations = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8000/api/all-appointments/?patient=${patientId}`);
//       setReservations(res.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to load reservations.');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReservations();
//   }, []);

//   const handleEdit = (reservation) => {
//     setSelectedReservation(reservation);
//     setNewDate(reservation.date);
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`http://localhost:8000/api/one-appointment/${selectedReservation.id}`, {
//         ...selectedReservation,
//         date: newDate,
//       });
//       setSuccessMessage('Reservation updated successfully!');
//       setSelectedReservation(null);
//       fetchReservations();
//     } catch (err) {
//       setError('Failed to update reservation.');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/one-appointment/${id}`);
//       setSuccessMessage('Reservation cancelled successfully.');
//       fetchReservations();
//     } catch (err) {
//       setError('Failed to cancel reservation.');
//     }
//   };

//   if (loading) return <Box p={3}><CircularProgress /></Box>;
//   if (error) return <Box p={3}><Typography color="error">{error}</Typography></Box>;

//   return (
//     <Box p={3}>
//       <Typography variant="h4" mb={3}>Your Reservations</Typography>
//       {reservations.length === 0 && (
//         <Typography>No reservations found.</Typography>
//       )}

//       <Stack spacing={2}>
//         {reservations.map((res) => (
//           <Card key={res.id} sx={{ p: 2 }}>
//             <CardContent>
//               <Typography variant="h6">Doctor: {res.doctor_name}</Typography>
//               <Typography>Date: {format(new Date(res.date), 'yyyy-MM-dd HH:mm')}</Typography>
//               <Typography>Status: {res.status}</Typography>
//               <Typography>Notes: {res.notes || 'N/A'}</Typography>

//               <Stack direction="row" spacing={2} mt={2}>
//                 <Button variant="outlined" onClick={() => handleEdit(res)}>Edit</Button>
//                 <Button variant="outlined" color="error" onClick={() => handleDelete(res.id)}>Cancel</Button>
//               </Stack>
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>

//       {/* Edit Dialog */}
//       <Dialog open={!!selectedReservation} onClose={() => setSelectedReservation(null)}>
//         <DialogTitle>Edit Reservation</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="New Date & Time"
//             type="datetime-local"
//             fullWidth
//             value={newDate}
//             onChange={(e) => setNewDate(e.target.value)}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedReservation(null)}>Cancel</Button>
//           <Button onClick={handleUpdate} variant="contained">Save</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar Alert */}
//       <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage('')}>
//         <Alert severity="success" onClose={() => setSuccessMessage('')}>
//           {successMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// // export default PatientReservations;
// export default AppointmentConfirmation