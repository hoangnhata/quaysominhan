import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const ExcellentEmployeeGrid = ({ employees, onEmployeeClick, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // Tự động chuyển trang sau mỗi 8 giây

    return () => clearInterval(timer);
  }, [totalPages]);

  const currentEmployees = employees.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background:
          "radial-gradient(circle at center, #0F2A44 0%, #060D17 100%)",
        display: "flex",
        flexDirection: "column",
        pt: 4,
        pb: 2,
      }}
    >
      {/* Back Button */}
      <Button
        onClick={onBack}
        sx={{
          position: "absolute",
          top: 30,
          left: 30,
          color: "#D4AF37",
          border: "1px solid rgba(212, 175, 55, 0.5)",
          borderRadius: 0,
          px: 3,
          zIndex: 100,
          "&:hover": {
            border: "1px solid #D4AF37",
            bgcolor: "rgba(212, 175, 55, 0.1)",
          },
        }}
      >
        ← QUAY LẠI
      </Button>

      <Container
        maxWidth="xl"
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 0.5,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#D4AF37",
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "3rem",
            }}
          >
            NHÂN VIÊN XUẤT SẮC
          </Typography>
          <Box
            sx={{
              width: 150,
              height: 2,
              bgcolor: "#D4AF37",
              mx: "auto",
              mb: 3,
              position: "relative",
            }}
          />
        </motion.div>

        <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ x: 1000, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -1000, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ width: "100%" }}
              >
                <Grid container spacing={2} justifyContent="center">
                  {currentEmployees.map((emp) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2.4}
                      lg={2.4}
                      key={emp.id}
                      sx={{ display: "flex" }}
                    >
                      <motion.div
                        variants={item}
                        style={{ display: "flex", width: "100%" }}
                      >
                        <Card
                          onClick={() => onEmployeeClick(emp)}
                          sx={{
                            bgcolor: "rgba(15, 42, 68, 0.4)",
                            backdropFilter: "blur(15px)",
                            border: "1px solid rgba(212, 175, 55, 0.15)",
                            borderRadius: "8px", // Bo nhẹ góc cho hiện đại
                            flex: 1,
                            cursor: "pointer",
                            transition:
                              "all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "4px",
                              background:
                                "linear-gradient(90deg, transparent, #D4AF37, transparent)",
                              opacity: 0,
                              transition: "0.3s",
                            },
                            "&:hover": {
                              transform: "translateY(-10px) scale(1.02)",
                              borderColor: "rgba(212, 175, 55, 0.5)",
                              boxShadow:
                                "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212, 175, 55, 0.2)",
                              bgcolor: "rgba(15, 42, 68, 0.6)",
                              "&::before": { opacity: 1 },
                              "& .emp-avatar": {
                                borderColor: "#D4AF37",
                                boxShadow: "0 0 25px rgba(212, 175, 55, 0.4)",
                                transform: "scale(1.05)",
                              },
                              "& .emp-name": { color: "#FCF6BA" },
                            },
                          }}
                        >
                          <CardContent
                            sx={{
                              textAlign: "center",
                              p: 2,
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            {/* Decorative corner */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                width: 15,
                                height: 15,
                                borderTop: "1px solid rgba(212, 175, 55, 0.3)",
                                borderRight:
                                  "1px solid rgba(212, 175, 55, 0.3)",
                              }}
                            />

                            <Avatar
                              src={emp.imageUrl}
                              className="emp-avatar"
                              sx={{
                                width: 130,
                                height: 160,
                                mb: 2,
                                borderRadius: "4px",
                                border: "2px solid rgba(212, 175, 55, 0.2)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                                transition: "all 0.5s ease",
                                objectFit: "cover",
                              }}
                            />
                            <Typography
                              className="emp-name"
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "white",
                                fontSize: "1.3rem",
                                fontFamily: '"Cormorant Garamond", serif',
                                mb: 0.5,
                                transition: "all 0.3s ease",
                              }}
                            >
                              {emp.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255,255,255,0.5)",
                                fontSize: "0.85rem",
                                fontStyle: "italic",
                                letterSpacing: 1,
                              }}
                            >
                              {emp.title}
                            </Typography>

                            {/* Award Badge Tag */}
                            <Box
                              sx={{
                                mt: 1.5,
                                px: 1.5,
                                py: 0.3,
                                border: "1px solid rgba(212, 175, 55, 0.2)",
                                borderRadius: "20px",
                                fontSize: "0.65rem",
                                color: "#D4AF37",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                              }}
                            >
                              {emp.badge || "Excellent Staff"}
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Page Indicators */}
        {totalPages > 1 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}
          >
            {[...Array(totalPages)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: i === currentPage ? 40 : 12,
                  height: 6,
                  bgcolor:
                    i === currentPage ? "#D4AF37" : "rgba(212, 175, 55, 0.3)",
                  transition: "all 0.5s ease",
                  borderRadius: 3,
                }}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ExcellentEmployeeGrid;
