import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";

const HomeScreen = ({ onStart, onSelectCategory }) => {
  const categories = [
    { id: "TEAM", title: "TẬP THỂ XUẤT SẮC" },
    { id: "LEADER", title: "TRƯỞNG KHOA XUẤT SẮC" },
    { id: "EXCELLENT", title: "NHÂN VIÊN XUẤT SẮC" },
    { id: "DEDICATED", title: "NHÂN VIÊN CỐNG HIẾN" },
  ];

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
        alignItems: "center",
        justifyContent: "center",
        gap: 25,
        pt: 2,
        pb: 12,
        color: "white",
      }}
    >
      {/* Stage Light Beams */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            rotate: [-15, -10, -15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: -200,
            left: "10%",
            width: "300px",
            height: "1500px",
            background:
              "linear-gradient(to bottom, rgba(212, 175, 55, 0.2), transparent)",
            filter: "blur(80px)",
            transform: "rotate(-15deg)",
          }}
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            rotate: [15, 10, 15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: -200,
            right: "10%",
            width: "300px",
            height: "1500px",
            background:
              "linear-gradient(to bottom, rgba(212, 175, 55, 0.2), transparent)",
            filter: "blur(80px)",
            transform: "rotate(15deg)",
          }}
        />
      </Box>

      {/* Stars Background */}
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: Math.random() }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + "px",
            height: Math.random() * 3 + "px",
            background: "#D4AF37",
            borderRadius: "50%",
            boxShadow: "0 0 5px #D4AF37",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Header / Logo */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ textAlign: "center", zIndex: 10 }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            letterSpacing: 8,
            color: "#D4AF37",
            mb: 1,
            fontWeight: 600,
          }}
        >
          BỆNH VIỆN MINH AN
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 800,
            fontSize: "4.5rem",
            background: "linear-gradient(to bottom, #FCF6BA, #BF953F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 10px 20px rgba(0,0,0,0.5)",
            lineHeight: 1,
            mb: 1,
          }}
        >
          MINH AN HOSPITAL
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            letterSpacing: 12,
            fontWeight: 300,
            opacity: 0.8,
            mb: 3,
          }}
        >
          YEAR-END AWARDS
        </Typography>

        {/* Logo under Year-End Awards */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: 1,
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { delay: 0.5, duration: 1 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                top: "-10%",
                left: "-10%",
                right: "-10%",
                bottom: "-10%",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                borderRadius: "50%",
                animation: "spin 10s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              },
            }}
          >
            <Box
              component="img"
              src="/logo.jpg"
              alt="Minh An Logo"
              sx={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "3px solid #D4AF37",
                p: 0.5,
                bgcolor: "white",
                boxShadow: "0 0 40px rgba(212, 175, 55, 0.5)",
                objectFit: "contain",
              }}
            />
          </Box>
        </motion.div>
      </motion.div>

      {/* Main Start Button with Enhanced Effects */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{ zIndex: 10 }}
      >
        <Button
          onClick={onStart}
          sx={{
            px: 10,
            py: 2.5,
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#060D17",
            bgcolor: "#D4AF37",
            borderRadius: "50px", // Rounded for modern luxury feel
            border: "3px solid #FCF6BA",
            fontFamily: '"Be Vietnam Pro", sans-serif',
            boxShadow:
              "0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 15px rgba(255,255,255,0.5)",
            transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              transition: "0.5s",
            },
            "&:hover": {
              bgcolor: "#FCF6BA",
              transform: "scale(1.1) translateY(-5px)",
              boxShadow: "0 20px 50px rgba(212, 175, 55, 0.6)",
              "&::before": {
                left: "100%",
                transition: "0.8s",
              },
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          BẮT ĐẦU LỄ VINH DANH
        </Button>
      </motion.div>

      {/* Category Grid */}
      <Box sx={{ width: "100%", maxWidth: "1400px", px: 4, zIndex: 10 }}>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat, index) => (
            <Grid item xs={12} sm={6} md={3} key={cat.id}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
              >
                <Box
                  onClick={() => onSelectCategory(cat.id)}
                  sx={{
                    height: "180px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 3,
                    cursor: "pointer",
                    border: "2px solid rgba(212, 175, 55, 0.3)",
                    background: "rgba(15, 42, 68, 0.4)",
                    backdropFilter: "blur(10px)",
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "4px",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)",
                      transition: "0.6s",
                    },
                    "&:hover": {
                      borderColor: "#D4AF37",
                      transform: "translateY(-15px) scale(1.02)",
                      boxShadow:
                        "0 15px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)",
                      background: "rgba(15, 42, 68, 0.7)",
                      "&::before": {
                        left: "100%",
                      },
                      "& .cat-icon": {
                        transform: "scale(1.2) rotate(10deg)",
                        color: "#FCF6BA",
                      },
                      "& .cat-title": {
                        color: "#FCF6BA",
                        letterSpacing: "4px",
                      },
                    },
                  }}
                >
                  <Typography
                    className="cat-icon"
                    variant="h3"
                    sx={{ mb: 2, transition: "all 0.4s" }}
                  >
                    🏆
                  </Typography>
                  <Typography
                    className="cat-title"
                    variant="h5"
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: "#D4AF37",
                      transition: "all 0.4s",
                      textTransform: "uppercase",
                    }}
                  >
                    {cat.title}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bottom Laurel Wreath Ornament */}
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          opacity: 0.05,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <img
          src="https://www.freeiconspng.com/uploads/gold-laurel-wreath-png-2.png"
          alt="wreath"
          style={{ width: "800px", filter: "brightness(0) invert(1)" }}
        />
      </Box>
    </Box>
  );
};

export default HomeScreen;
