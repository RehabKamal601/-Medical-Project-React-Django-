import React from "react";
import {
  Avatar,
  // BottomNavigation,
  // BottomNavigationAction,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import {
  Favorite,
  EventNote,
  Payment,
  QuestionAnswer,
  Logout,
  // Home,
  // Chat,
  // CalendarToday,
  // Person,
} from "@mui/icons-material";

const PatientProfile = () => {
  // const [value, setValue] = React.useState(3); // 3 = Profile tab selected

  return (
    <Box sx={{ pt: 8, pb: 2, bgcolor: "#e0f7f5", minHeight: "100vh" }}>
      
      <Card
        sx={{
          m: 2,
          p: 2,
          borderRadius: 4,
          textAlign: "center",
          background: "linear-gradient(to right, #2BC0E4, #EAECC6)",
          color: "#fff",
        }}
      >
        <Avatar
          src='https://randomuser.me/api/portraits/women/44.jpg'
          sx={{ width: 80, height: 80, margin: "0 auto" }}
        />
        <Typography variant='h6' sx={{ mt: 1 }}>
          Amelia Renata
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <Box>
            <Typography variant='body2'>Heart rate</Typography>
            <Typography fontWeight='bold'>215bpm</Typography>
          </Box>
          <Box>
            <Typography variant='body2'>Calories</Typography>
            <Typography fontWeight='bold'>756cal</Typography>
          </Box>
          <Box>
            <Typography variant='body2'>Weight</Typography>
            <Typography fontWeight='bold'>103lbs</Typography>
          </Box>
        </Box>
      </Card>

      {/* Options List */}
      <Paper sx={{ borderRadius: "24px 24px 0 0", p: 2 }}>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Favorite sx={{ color: "#3ACCE1" }} />
            </ListItemIcon>
            <ListItemText primary='My Saved' />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <EventNote sx={{ color: "#3ACCE1" }} />
            </ListItemIcon>
            <ListItemText primary='Appointment' />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <Payment sx={{ color: "#3ACCE1" }} />
            </ListItemIcon>
            <ListItemText primary='Payment Method' />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <QuestionAnswer sx={{ color: "#3ACCE1" }} />
            </ListItemIcon>
            <ListItemText primary='FAQs' />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <Logout sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText
              primary='Logout'
              primaryTypographyProps={{ color: "red" }}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default PatientProfile;
