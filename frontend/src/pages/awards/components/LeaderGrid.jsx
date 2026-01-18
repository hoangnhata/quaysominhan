import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
  Paper,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

const LeaderGrid = ({ leaders, onBack }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
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
        pt: 8,
        pb: 4,
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
          zIndex: 10,
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
              mb: 1,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#D4AF37",
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "3.5rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            TRƯỞNG KHOA XUẤT SẮC
          </Typography>
          <Box
            sx={{
              width: 150,
              height: 2,
              bgcolor: "#D4AF37",
              mx: "auto",
              mb: 6,
              position: "relative",
            }}
          />
        </motion.div>

        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ width: "100%" }}
          >
            <Grid container spacing={3} justifyContent="center">
              {leaders.map((leader) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2.4}
                  key={leader.id}
                  sx={{ display: "flex" }}
                >
                  <motion.div
                    variants={item}
                    style={{ display: "flex", width: "100%" }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: "rgba(15, 42, 68, 0.4)",
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(212, 175, 55, 0.15)",
                        borderRadius: "8px",
                        textAlign: "center",
                        transition:
                          "all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
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
                          "& .leader-avatar": {
                            borderColor: "#D4AF37",
                            boxShadow: "0 0 25px rgba(212, 175, 55, 0.4)",
                            transform: "scale(1.05)",
                          },
                          "& .leader-name": { color: "#FCF6BA" },
                        },
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
                          borderRight: "1px solid rgba(212, 175, 55, 0.3)",
                        }}
                      />

                      <Avatar
                        src={leader.imageUrl}
                        className="leader-avatar"
                        sx={{
                          width: 140,
                          height: 180,
                          mb: 2,
                          borderRadius: "4px",
                          border: "2px solid rgba(212, 175, 55, 0.3)",
                          boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                          transition: "all 0.5s ease",
                        }}
                      />
                      <Typography
                        className="leader-name"
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "white",
                          fontSize: "1.4rem",
                          fontFamily: '"Cormorant Garamond", serif',
                          mb: 0.5,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {leader.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.95rem",
                          fontStyle: "italic",
                        }}
                      >
                        {leader.title}
                      </Typography>

                      {/* Award Badge Tag */}
                      <Box
                        sx={{
                          mt: 1.5,
                          px: 2,
                          py: 0.5,
                          border: "1px solid rgba(212, 175, 55, 0.2)",
                          borderRadius: "20px",
                          fontSize: "0.7rem",
                          color: "#D4AF37",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontWeight: 600,
                        }}
                      >
                        {leader.badge || "Outstanding Leader"}
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default LeaderGrid;
