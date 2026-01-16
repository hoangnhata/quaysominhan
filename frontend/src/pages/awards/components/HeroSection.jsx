import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { Stars as StarsIcon } from "@mui/icons-material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background:
          "radial-gradient(circle at center, #0F2A44 0%, #0B1F3A 100%)",
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* Background Particles Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />

      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: Math.random() * 1000 }}
          animate={{
            opacity: [0, 0.5, 0],
            y: [null, -1000],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            width: Math.random() * 3 + "px",
            height: Math.random() * 3 + "px",
            background: "#D4AF37",
            borderRadius: "50%",
          }}
        />
      ))}

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Box
            sx={{
              mb: 4,
              position: "relative",
              display: "inline-block",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 120,
                height: 120,
                border: "1px solid rgba(212, 175, 55, 0.3)",
                borderRadius: "50%",
                animation: "spin 20s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
                  "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
                },
              }}
            />
            <StarsIcon
              sx={{
                fontSize: 70,
                color: "#D4AF37",
                filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))",
              }}
            />
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "5.5rem" },
              fontWeight: 800,
              letterSpacing: "0.05em",
              mb: 2,
              // Enhanced Gold Foil Effect
              background:
                "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 15px 30px rgba(0,0,0,0.5)",
              lineHeight: 1.2,
              padding: "20px 0",
              display: "block",
              fontFamily: '"Cormorant Garamond", serif',
              textTransform: "uppercase",
            }}
          >
            LỄ VINH DANH CUỐI NĂM
            <br />
            <Box
              component="span"
              sx={{ fontSize: "0.7em", display: "block", mt: 1 }}
            >
              BỆNH VIỆN MINH AN
            </Box>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              letterSpacing: 1.5,
              color: "#FFFFFF",
              fontStyle: "italic",
              maxWidth: "900px",
              mx: "auto",
              mb: 6,
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              opacity: 0.9,
              fontFamily: '"Cormorant Garamond", serif',
              lineHeight: 1.6,
            }}
          >
            “Nơi tôn vinh những cống hiến thầm lặng và dấu ấn kiệt xuất của tập
            thể y bác sĩ”
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Box
            component="a"
            href="#outstanding-team"
            sx={{
              textDecoration: "none",
              color: "#D4AF37",
              border: "1px solid rgba(212, 175, 55, 0.5)",
              px: 6,
              py: 2,
              borderRadius: "0",
              textTransform: "uppercase",
              letterSpacing: 4,
              fontSize: "0.85rem",
              fontWeight: 600,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
              display: "inline-block",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)",
                transition: "all 0.5s",
              },
              "&:hover": {
                borderColor: "#D4AF37",
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.2)",
                letterSpacing: 6,
                "&::before": {
                  left: "100%",
                },
              },
            }}
          >
            Bắt đầu buổi lễ
          </Box>
        </motion.div>
      </Container>

      {/* Laurel Wreath Ornament */}
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          opacity: 0.1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <img
          src="https://www.freeiconspng.com/uploads/gold-laurel-wreath-png-2.png"
          alt="wreath"
          style={{ width: "600px", filter: "brightness(0) invert(1)" }}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
