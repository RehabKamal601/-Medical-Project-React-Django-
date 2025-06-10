export const styles = {
  container: {
    p: 4,
    maxWidth: "1400px",
    mx: "auto"
  },
  headerContainer: {
    mb: 4,
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 3,
    backgroundColor: "#ffffff",
    borderRadius: 3,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  headerIcon: {
    color: "#10b981",
    fontSize: 32
  },
  emptyStateContainer: {
    p: 6,
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: 3,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  emptyStateSubtext: {
    mt: 1
  },
  appointmentCard: {
    p: 3,
    borderRadius: 3,
    borderLeft: "4px solid #10b981",
    background: "#ffffff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      borderLeft: "4px solid #059669"
    },
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      background: "linear-gradient(90deg, #10b981, #a7f3d0)"
    }
  },
  patientName: {
    mb: 0.5
  },
  timeInfo: {
    display: "flex",
    alignItems: "center",
    gap: 1
  },
  timeIcon: {
    fontSize: 16,
    color: "#10b981"
  },
  statusIcon: {
    color: "#10b981",
    fontSize: 28
  },
  notesContainer: {
    p: 2,
    mt: 2,
    borderRadius: 2,
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0"
  },
  notes: {
    fontStyle: "normal",
    color: "#64748b"
  },
  emptyNotes: {
    fontStyle: "italic",
    color: "#94a3b8"
  },
  paginationContainer: {
    mt: 4,
    p: 3,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 3,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "#64748b",
      "&.Mui-selected": {
        backgroundColor: "#10b981",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#059669"
        }
      },
      "&:hover": {
        backgroundColor: "#e2e8f0"
      }
    }
  }
}; 