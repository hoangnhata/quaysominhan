import React, { useState, useEffect } from "react";
// Version: 1.1.0 - Fullscreen Lucky Draw & Simplified Admin
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import LuckyDrawPage from "./pages/LuckyDrawPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Settings,
  Analytics,
  MedicalServices,
  Stars,
} from "@mui/icons-material";
import { SnackbarProvider } from "notistack";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show navigation on Lucky Draw page (fullscreen)
  if (currentPath === "/") {
    return null;
  }

  const getTabValue = () => {
    if (currentPath === "/admin") return 0;
    return 0;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#004d40",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "center", px: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#fff", letterSpacing: 2 }}
        >
          ADMIN PANEL
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

function AppContent() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<LuckyDrawPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </SnackbarProvider>
  );
}

export default App;
