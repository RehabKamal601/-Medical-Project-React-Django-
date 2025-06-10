import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TodayIcon from "@mui/icons-material/Today";
import { styles } from "../doctorStyle/DoctorDashboard.styles";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // يمكن استخدام هذه البيانات من API أو Redux store
  const dashboardData = {
    doctor: {
      name: "Dr. John",
      title: "Cardiologist"
    },
    stats: [
      {
        id: 1,
        title: "Upcoming Appointments",
        value: 5,
        icon: AccessTimeIcon,
        action: "View Schedule",
        theme: "appointments",
        path: "/doctor/appointments"
      },
      {
        id: 2,
        title: "Total Patients",
        value: 12,
        icon: PeopleAltIcon,
        action: "View Patients",
        theme: "patients",
        path: "/doctor/patients"
      },
      {
        id: 3,
        title: "Today's Appointments",
        value: 3,
        icon: TodayIcon,
        action: "View Today",
        theme: "today",
        path: "/doctor/schedule"
      }
    ]
  };

  const renderCard = (stat) => {
    const Icon = stat.icon;
    const theme = styles.themes[stat.theme];

    return (
      <Grid item xs={12} sm={6} md={4} key={stat.id}>
        <Paper 
          elevation={0} 
          sx={styles.card(theme)}
          onClick={() => handleNavigation(stat.path)}
        >
          <Box sx={styles.cardHeader}>
            <Icon sx={styles.cardIcon} />
            <Typography variant="h6" sx={styles.cardTitle}>
              {stat.title}
            </Typography>
          </Box>
          <Typography variant="h3" sx={styles.cardValue}>
            {stat.value}
          </Typography>
          <Button 
            variant="contained" 
            fullWidth
            sx={styles.cardButton(theme.color)}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation(stat.path);
            }}
          >
            {stat.action}
          </Button>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 2 }}>
        <Typography variant="h4" sx={styles.welcomeText}>
          Welcome, {dashboardData.doctor.name}
        </Typography>
        <Typography sx={styles.subtitle}>
          {dashboardData.doctor.title} | Dashboard Overview
        </Typography>
        
        <Grid container spacing={4} sx={styles.gridContainer}>
          {dashboardData.stats.map(renderCard)}
        </Grid>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;