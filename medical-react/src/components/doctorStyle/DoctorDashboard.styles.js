export const styles = {
  mainContainer: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    p: 4,
    backgroundImage: `linear-gradient(to right bottom, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8))`,
  },
  welcomeText: {
    fontWeight: 700,
    color: "#1e293b",
    fontSize: "2rem",
    mb: 1,
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  subtitle: {
    color: "#64748b",
    mb: 4,
    fontSize: "1.1rem",
  },
  gridContainer: {
    mt: 3,
  },
  card: (theme) => ({
    p: 3.5,
    borderRadius: "16px",
    background: theme.gradient,
    color: "white",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    },
  }),
  cardHeader: {
    display: "flex",
    alignItems: "center",
    mb: 3,
  },
  cardIcon: {
    fontSize: "2.5rem",
    opacity: 0.9,
  },
  cardTitle: {
    ml: 2,
    fontSize: "1.25rem",
    fontWeight: 600,
    opacity: 0.9,
  },
  cardValue: {
    fontWeight: 700,
    fontSize: "2.5rem",
    mb: 2,
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  cardButton: (color) => ({
    mt: 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: color,
    fontWeight: 600,
    px: 3,
    py: 1,
    "&:hover": {
      backgroundColor: "white",
      transform: "scale(1.02)",
    },
    transition: "all 0.2s ease-in-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }),
  themes: {
    appointments: {
      gradient: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
      color: "#4f46e5"
    },
    patients: {
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      color: "#059669"
    },
    today: {
      gradient: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
      color: "#db2777"
    }
  }
};
