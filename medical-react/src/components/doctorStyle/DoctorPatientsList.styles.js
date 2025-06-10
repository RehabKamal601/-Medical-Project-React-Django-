export const styles = {
  container: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    p: 4
  },
  header: {
    mb: 4
  },
  title: {
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "2rem",
    mb: 1
  },
  subtitle: {
    color: "#64748b",
    fontSize: "1.1rem"
  },
  searchContainer: {
    display: "flex",
    gap: 2,
    mb: 4
  },
  searchField: {
    flex: 1,
    backgroundColor: "white",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0"
      }
    }
  },
  filterButton: {
    borderRadius: "12px",
    backgroundColor: "white",
    color: "#4f46e5",
    borderColor: "#e2e8f0",
    "&:hover": {
      backgroundColor: "#f8fafc",
      borderColor: "#4f46e5"
    }
  },
  addButton: {
    borderRadius: "12px",
    backgroundColor: "#4f46e5",
    "&:hover": {
      backgroundColor: "#4338ca"
    }
  },
  patientCard: {
    p: 3,
    borderRadius: "16px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
      borderColor: "#4f46e5"
    }
  },
  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 2
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "16px",
    backgroundColor: "#e2e8f0"
  },
  nameContainer: {
    flex: 1
  },
  name: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "1.1rem"
  },
  patientId: {
    color: "#64748b",
    fontSize: "0.9rem"
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 2,
    mb: 3
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: 0.5
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "0.9rem"
  },
  detailValue: {
    color: "#1e293b",
    fontWeight: 500
  },
  actionButtons: {
    display: "flex",
    gap: 2
  },
  viewButton: {
    flex: 1,
    borderRadius: "10px",
    backgroundColor: "#4f46e5",
    "&:hover": {
      backgroundColor: "#4338ca"
    }
  },
  messageButton: {
    flex: 1,
    borderRadius: "10px",
    backgroundColor: "white",
    color: "#4f46e5",
    borderColor: "#e2e8f0",
    "&:hover": {
      backgroundColor: "#f8fafc",
      borderColor: "#4f46e5"
    }
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    mt: 4,
    "& .MuiPagination-ul": {
      gap: 1
    }
  }
}; 