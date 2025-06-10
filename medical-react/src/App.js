import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { AuthProvider } from './hooks/useAuth';

// Public Pages
import MainDashboard from "./pages/MainDashboard";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";

// Doctor
import DoctorDashboard from "./components/Doctor/DoctorDashboard";
import DoctorAppointments from "./components/Doctor/DoctorAppointments";
import DoctorAvailability from "./components/Doctor/DoctorAvailability";
import DoctorProfile from "./components/Doctor/DoctorProfile";
import DoctorSidebar from "./components/Doctor/DoctorSidebar";
import DoctorSchedule from "./components/Doctor/DoctorSchedule";
import DoctorPatientsList from "./components/Doctor/DoctorPatientsList";

// Admin
import AdminDoctorApproval from "./components/admin/Approval/AdminDoctorsApproval";
import AdminPatientApproval from "./components/admin/Approval/AdminPatientApproval";
import AdminLayout from "./components/admin/shared/AdminLayout";
import DoctorList from "./components/admin/UserManagement/DoctorList";
import PatientsList from "./components/admin/UserManagement/PatientsList";
import DoctorDetails from "./components/admin/UserManagement/DoctorDetails";
import PatientDetails from "./components/admin/UserManagement/PatientDetails";
import AppointmentsList from "./components/admin/Appointments/AppointmentsList";
import SpecialtiesList from "./components/admin/Specialties/SpecialtyList";
import AdminHomePage from "./components/Home/AdminHomePage";
import Notifications from "./pages/admin/Notifications";
import AdminProfile from "./pages/admin/AdminProfile";

// Patient
import PatientLayout from "./layouts/PatientLayout";
import FindDoctorsView from "./features/patients/FindDoctorsView";
import DoctorInfo from "./features/patients/DoctorInfo";
import MyAppointments from "./features/patients/MyAppointments";
import AppointmentConfirmation from "./features/patients/AppointmentConfirmation";
import Profile from "./features/patients/Profile";

// Patient Routes
function PatientRoutes() {
  return (
    <ThemeProvider theme={theme}>
      <PatientLayout>
        <Routes>
          <Route path='/' element={<FindDoctorsView />} />
          <Route path='doctors/:docId' element={<DoctorInfo/>} />
          {/* <Route path='patients' element={<PatientsList />} /> */}
          <Route path='my-appointments' element={<MyAppointments />} />
          <Route
            path='confirm-appointment/:docId'
            element={<AppointmentConfirmation />}
          />
          <Route path='profile' element={<Profile />} />
        </Routes>
      </PatientLayout>
    </ThemeProvider>
  );
}

// Doctor Routes
function DoctorLayout() {
  return (
    <div style={{ display: "flex" }}>
      <DoctorSidebar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="availability" element={<DoctorAvailability />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="patients" element={<DoctorPatientsList />} />
        </Routes>
      </div>
    </div>
  );
}

// Admin Routes
function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHomePage />} />
        <Route path="doctors" element={<DoctorList />} />
        <Route path="patients" element={<PatientsList />} />
        <Route path="doctors/:id" element={<DoctorDetails />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="appointments" element={<AppointmentsList />} />
        <Route path="specialties" element={<SpecialtiesList />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="AdminPatientApproval" element={<AdminPatientApproval />} />
        <Route path="AdminDoctorApproval" element={<AdminDoctorApproval />} />
        <Route path="AdminProfile" element={<AdminProfile />} />
      </Routes>
    </AdminLayout>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainDashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Role-based Routes */}
            <Route path="/doctor/*" element={<DoctorLayout />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/patient/*" element={<PatientRoutes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
