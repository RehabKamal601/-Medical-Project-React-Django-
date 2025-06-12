import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TodayIcon from "@mui/icons-material/Today";
import { styles } from "../doctorStyle/DoctorDashboard.styles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    doctor: { 
      name: user ? `Dr. ${user.username}` : "Loading...",
      title: user?.specialization || "Doctor"
    },
    stats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/doctor/dashboard/stats/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep the UI structure but show zeros
        setDashboardData({
          doctor: {
            name: user ? `Dr. ${user.username}` : "Doctor",
            title: user?.specialization || "Doctor"
          },
          stats: [
            {
              id: 1,
              title: "Upcoming Appointments",
              value: 0,
              action: "View Schedule",
              theme: "appointments",
              path: "/doctor/appointments"
            },
            {
              id: 2,
              title: "Total Patients",
              value: 0,
              action: "View Patients",
              theme: "patients",
              path: "/doctor/patients"
            },
            {
              id: 3,
              title: "Today's Appointments",
              value: 0,
              action: "View Today",
              theme: "today",
              path: "/doctor/schedule"
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getIcon = (id) => {
    switch(id) {
      case 1:
        return AccessTimeIcon;
      case 2:
        return PeopleAltIcon;
      case 3:
        return TodayIcon;
      default:
        return AccessTimeIcon;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const renderCard = (stat) => {
    const Icon = getIcon(stat.id);
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

  if (loading) {
    return (
      <Box sx={styles.mainContainer}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 2 }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h3" sx={{ 
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            textAlign: 'left'
          }}>
            {getGreeting()}
          </Typography>
          <Typography variant="h4" sx={{ 
            marginBottom: '0.5rem',
            textAlign: 'left'
          }}>
            {dashboardData.doctor.name}
          </Typography>
          <Typography variant="h6" sx={{ 
            opacity: 0.9,
            textAlign: 'left'
          }}>
            We wish you a successful day
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ 
          marginBottom: '2rem',
          color: '#666',
          textAlign: 'left'
        }}>
          {dashboardData.doctor.title} | Dashboard
        </Typography>
        
        <Grid container spacing={4} sx={styles.gridContainer}>
          {dashboardData.stats.map(renderCard)}
        </Grid>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;