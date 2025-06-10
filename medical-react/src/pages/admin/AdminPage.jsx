import React from "react";
import UnifiedLayout from "../../components/UnifiedLayout";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MedicalServices as DoctorsIcon,
  Healing as SpecialtiesIcon,
  Event as AppointmentsIcon,
  Notifications as NotificationsIcon,
  VerifiedUser as ApprovalIcon,
  Person as ProfileIcon,
  Home as HomeIcon,
  Chat as ChatIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const AdminPage = () => {
  const sidebarItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Doctors", icon: <DoctorsIcon />, path: "/admin/doctors" },
    { text: "Patients", icon: <PeopleIcon />, path: "/admin/patients" },
    {
      text: "Specialties",
      icon: <SpecialtiesIcon />,
      path: "/admin/specialties",
    },
    {
      text: "Appointments",
      icon: <AppointmentsIcon />,
      path: "/admin/appointments",
    },
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      path: "/admin/notifications",
    },
    {
      text: "Doctor Approval",
      icon: <ApprovalIcon />,
      path: "/admin/doctor-approval",
    },
    {
      text: "Patient Approval",
      icon: <ApprovalIcon />,
      path: "/admin/patient-approval",
    },
    { text: "Admin Profile", icon: <ProfileIcon />, path: "/admin/profile" },
  ];

  return (
    <UnifiedLayout
      role="admin"
      title="Admin Dashboard"
      userInitial="A"
      bgColor="primary.main"
      showNavIcons={false}
      sidebarItems={sidebarItems}
      showSidebarToggle={false}
    >
      <div>
        <h1>Welcome to Admin Dashboard</h1>
        {/* محتوى الصفحة الرئيسية للإدمن هنا */}
      </div>
    </UnifiedLayout>
  );
};

export default AdminPage;
