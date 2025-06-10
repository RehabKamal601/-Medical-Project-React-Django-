// DoctorSidebar.styles.js
import { styled } from "@mui/material";
import { ListItem, ListItemText } from "@mui/material";

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&.MuiListItem-root': {
    padding: '12px 24px',
    margin: '6px 12px',
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: '#3a4a5d',
      '& .MuiListItemIcon-root': {
        color: '#5d9cec'
      }
    },
    '&.Mui-selected': {
      backgroundColor: '#3a4a5d',
      borderLeft: '4px solid #5d9cec'
    }
  }
}));

export const WhiteLinkText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    color: '#f5f7fa !important',
    fontSize: '1rem',
    fontWeight: '500',
    '&:hover': {
      color: '#ffffff !important'
    }
  }
}));

export const styles = {
  drawer: {
    width: 300,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 300,
      boxSizing: "border-box",
      borderRight: "none",
      backgroundColor: "#2b3647",
      color: "white",
      display: "flex",
      flexDirection: "column",
      boxShadow: '2px 0 10px rgba(36, 34, 34, 0.1)'
    }
  },
  profileContainer: {
    p: 4,
    textAlign: "center",
    pt: 5,
    pb: 3
  },
  avatar: {
    width: 100,
    height: 100,
    margin: "0 auto 16px",
    border: "3px solid #5d9cec",
    boxShadow: '0 0 15px rgba(30, 118, 233, 0.4)'
  },
  doctorName: {
    fontWeight: 600,
    mb: 1,
    color: '#ffffff',
    fontSize: '1.25rem'
  },
  specialty: {
    color: '#d1d8e0',
    fontSize: '0.875rem'
  },
  divider: {
    backgroundColor: "#3a4a5d",
    height: '2px',
    my: 2
  },
  listContainer: {
    flexGrow: 1,
    px: 3
  },
  listIcon: {
    color: "#d1d8e0",
    minWidth: '45px',
    '&.MuiListItemIcon-root': {
      fontSize: '1.25rem'
    }
  },
  listItemText: {
    variant: 'body1',
    sx: { 
      fontWeight: 500,
      fontSize: '1rem'
    }
  },
  footerContainer: {
    p: 3,
    pt: 0
  },
  footerDivider: {
    backgroundColor: "#3a4a5d",
    height: '2px',
    mb: 2
  }
};