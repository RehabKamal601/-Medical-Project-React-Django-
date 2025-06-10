export const styles = {
  mainBox: {
    p: { xs: 1.5, sm: 2, md: 3 },
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  headerBox: {
    display: "flex", 
    alignItems: "center", 
    mb: 3,
    p: 2,
    backgroundColor: "#ffffff",
    borderRadius: 1.5,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  },
  calendarIcon: {
    fontSize: 28, 
    mr: 1.5, 
    color: "#10b981",
    backgroundColor: "#ecfdf5",
    p: 0.5,
    borderRadius: "50%"
  },
  filterPaper: {
    p: 2,
    mb: 3,
    borderRadius: 1.5,
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  filterIcon: { 
    color: "#64748b", 
    fontSize: 20 
  },
  formControl: { 
    minWidth: 130 
  },
  dayFormControl: { 
    minWidth: 150 
  },
  selectStyle: { 
    fontSize: "0.85rem", 
    "& .MuiOutlinedInput-notchedOutline": { 
      borderRadius: 1 
    } 
  },
  menuItemStyle: { 
    fontSize: "0.85rem" 
  },
  dateField: { 
    width: 160, 
    "& .MuiOutlinedInput-notchedOutline": { 
      borderRadius: 1 
    } 
  },
  clearButton: { 
    ml: "auto", 
    borderColor: "#e2e8f0", 
    color: "#64748b", 
    "&:hover": { 
      borderColor: "#cbd5e1", 
      color: "#475569",
      backgroundColor: "#f1f5f9"
    },
    fontSize: "0.75rem",
    px: 1,
    py: 0.5
  },
  tabsPaper: {
    mb: 3,
    borderRadius: 1.5,
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  tabs: {
    "& .MuiTabs-flexContainer": { gap: 0.5 },
    "& .MuiTab-root": { 
      fontWeight: 600, 
      textTransform: "none", 
      fontSize: "0.85rem",
      px: 1.5,
      minHeight: 44,
      borderRadius: 0.5,
      "&.Mui-selected": {
        color: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)"
      }
    },
    "& .MuiTabs-indicator": {
      height: 3,
      backgroundColor: "#10b981"
    }
  },
  appointmentCard: {
    p: 2.5,
    borderRadius: 1.5,
    borderLeft: (status) => `4px solid ${
      status === "approved" ? "#10b981" :
      status === "rejected" ? "#ef4444" : "#f59e0b"
    }`,
    background: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    position: "relative",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
      borderLeftWidth: "5px"
    },
    height: "100%",
    display: "flex",
    flexDirection: "column",
    minWidth: 320,
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "8px",
      background: (status) => status === "approved"
        ? "linear-gradient(90deg, #10b981, #34d399)"
        : status === "rejected"
        ? "linear-gradient(90deg, #ef4444, #f87171)"
        : "linear-gradient(90deg, #f59e0b, #fbbf24)",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    },
  },
  avatar: {
    width: 36,
    height: 36,
    fontSize: "0.9rem",
  },
  divider: { 
    my: 1.5, 
    borderColor: "rgba(0,0,0,0.06)" 
  },
  statusIcon: { 
    color: "#64748b", 
    fontSize: 18 
  },
  notesField: { 
    mb: 1, 
    "& .MuiOutlinedInput-root": { 
      borderRadius: 1 
    } 
  },
  saveButton: { 
    minWidth: 95, 
    backgroundColor: "#10b981", 
    "&:hover": { backgroundColor: "#059669" },
    fontSize: "0.8rem",
    py: 0.5
  },
  cancelButton: { 
    minWidth: 95,
    fontSize: "0.8rem",
    py: 0.5
  },
  notesPaper: {
    p: 1.5,
    borderRadius: 1,
    minHeight: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#f8fafc",
    borderColor: "rgba(0,0,0,0.06)",
    "&:hover": { backgroundColor: "#f1f5f9" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.06)" }
  },
  editButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
    width: 24,
    height: 24
  },
  approveButton: {
    minWidth: 95,
    backgroundColor: "#10b981",
    "&:hover": { backgroundColor: "#059669" },
    textTransform: "none",
    fontSize: "0.8rem",
    py: 0.5
  },
  rejectButton: {
    minWidth: 95,
    borderColor: "#ef4444",
    color: "#ef4444",
    "&:hover": { borderColor: "#dc2626", color: "#dc2626" },
    textTransform: "none",
    fontSize: "0.8rem",
    py: 0.5
  },
  noAppointmentsPaper: {
    p: 3,
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: 1.5,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  },
  paginationBox: { 
    display: "flex", 
    justifyContent: "center", 
    mt: 10,
    p: 1.5,
    backgroundColor: "#ffffff",
    borderRadius: 1.5,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      fontSize: "0.85rem",
      minWidth: 30,
      height: 30,
      borderRadius: 15,
      "&.Mui-selected": {
        backgroundColor: "#10b981",
        color: "#fff",
        "&:hover": { backgroundColor: "#059669" }
      },
      "&:hover": { backgroundColor: "#e2e8f0" }
    }
  },
  statusChip: {
    approved: {
      fontWeight: 600,
      fontSize: "0.75rem",
      backgroundColor: "#10b981",
      color: "#fff",
      "&:hover": { backgroundColor: "#059669" },
      px: 1,
      py: 0.5
    },
    rejected: {
      fontWeight: 600,
      fontSize: "0.75rem",
      backgroundColor: "#ef4444",
      color: "#fff",
      "&:hover": { backgroundColor: "#dc2626" },
      px: 1,
      py: 0.5
    },
    pending: {
      fontWeight: 600,
      fontSize: "0.75rem",
      backgroundColor: "#f59e0b",
      color: "#fff",
      "&:hover": { backgroundColor: "#d97706" },
      px: 1,
      py: 0.5
    }
  }
}; 