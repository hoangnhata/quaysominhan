import React, { useState, useEffect } from "react";
import { Box, createTheme, ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import HomeScreen from "./components/HomeScreen";
import OutstandingTeam from "./components/OutstandingTeam";
import LeaderGrid from "./components/LeaderGrid";
import ExcellentEmployeeGrid from "./components/ExcellentEmployeeGrid";
import DedicatedEmployeeGrid from "./components/DedicatedEmployeeGrid";
import EmployeeModal from "./components/EmployeeModal";

const HONORS_API_URL = "http://localhost:8080/api/honors";

// Custom Luxury Theme
const luxuryTheme = createTheme({
  palette: {
    primary: {
      main: "#D4AF37", // Gold
    },
    background: {
      default: "#060D17", // Deeper Navy
      paper: "#0A192F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.6)",
    },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Be Vietnam Pro", serif',
    h1: { fontWeight: 700, letterSpacing: "0.02em" },
    h2: { fontWeight: 700, letterSpacing: "0.01em" },
    h3: { fontWeight: 600, letterSpacing: "0.01em" },
    body1: {
      fontFamily: '"Be Vietnam Pro", sans-serif',
      letterSpacing: "0.01em",
    },
    body2: { fontFamily: '"Be Vietnam Pro", sans-serif' },
  },
});

const AwardsPage = () => {
  const [currentScreen, setCurrentScreen] = useState("HOME");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [honorsData, setHonorsData] = useState({
    tapTheXuatSac: null,
    truongKhoaXuatSac: [],
    nhanVienXuatSac: [],
    nhanVienCongHien: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHonors();
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Be+Vietnam+Pro:wght@100;300;400;500;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {}
    };
  }, []);

  const fetchHonors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(HONORS_API_URL);
      const data = res.data;
      
      const grouped = {
        tapTheXuatSac: data.find(h => h.category === "tapTheXuatSac") || null,
        truongKhoaXuatSac: data.filter(h => h.category === "truongKhoaXuatSac"),
        nhanVienXuatSac: data.filter(h => h.category === "nhanVienXuatSac"),
        nhanVienCongHien: data.filter(h => h.category === "nhanVienCongHien"),
      };
      setHonorsData(grouped);
    } catch (error) {
      console.error("Error fetching honors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const pageTransition = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    switch (currentScreen) {
      case "HOME":
        return (
          <motion.div key="home" {...pageTransition}>
            <HomeScreen
              onStart={() => setCurrentScreen("TEAM")}
              onSelectCategory={(cat) => setCurrentScreen(cat)}
            />
          </motion.div>
        );
      case "TEAM":
        return (
          <motion.div key="team" {...pageTransition}>
            <OutstandingTeam
              data={honorsData.tapTheXuatSac}
              onBack={() => setCurrentScreen("HOME")}
            />
          </motion.div>
        );
      case "LEADER":
        return (
          <motion.div key="leader" {...pageTransition}>
            <LeaderGrid
              leaders={honorsData.truongKhoaXuatSac}
              onBack={() => setCurrentScreen("HOME")}
            />
          </motion.div>
        );
      case "EXCELLENT":
        return (
          <motion.div key="excellent" {...pageTransition}>
            <ExcellentEmployeeGrid
              employees={honorsData.nhanVienXuatSac}
              onEmployeeClick={handleEmployeeClick}
              onBack={() => setCurrentScreen("HOME")}
            />
          </motion.div>
        );
      case "DEDICATED":
        return (
          <motion.div key="dedicated" {...pageTransition}>
            <DedicatedEmployeeGrid
              employees={honorsData.nhanVienCongHien}
              onEmployeeClick={handleEmployeeClick}
              onBack={() => setCurrentScreen("HOME")}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={luxuryTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          bgcolor: "#060D17",
        }}
      >
        <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>

        <EmployeeModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          employee={selectedEmployee}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AwardsPage;
