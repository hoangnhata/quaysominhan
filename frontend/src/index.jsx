import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Polyfill for WebSocket libraries (sockjs, stompjs) in Vite
if (typeof global === "undefined") {
  window.global = window;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#00796b", // Medical Teal
      dark: "#004d40",
      light: "#48a999",
    },
    secondary: {
      main: "#1976d2", // Trust Blue
    },
    background: {
      default: "#f0f4f8", // Very light medical grey/blue
    },
  },
  typography: {
    fontFamily: "'Be Vietnam Pro', 'Inter', 'Roboto', sans-serif",
    h3: {
      fontWeight: 800,
      color: "#004d40",
      fontFamily: "'Be Vietnam Pro', sans-serif",
    },
    h5: {
      fontWeight: 600,
      fontFamily: "'Be Vietnam Pro', sans-serif",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          padding: "10px 24px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 10px 30px rgba(0, 121, 107, 0.05)",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
