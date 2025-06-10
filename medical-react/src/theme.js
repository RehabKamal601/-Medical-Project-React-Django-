import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#199A8E",
      light: "#45b0a5",
      dark: "#147a6e",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: "#f44336",
      light: "#ffebee",
      dark: "#d32f2f",
    },
    success: {
      main: "#4caf50",
      light: "#e6f7f5",
      dark: "#388e3c",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          padding: "8px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(25, 154, 142, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 16px rgba(25, 154, 142, 0.15)",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#199A8E",
            color: "white",
            fontSize: 16,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
          },
        },
      },
    },
  },
});

export default theme;
