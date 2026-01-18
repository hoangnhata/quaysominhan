import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";

const OutstandingTeam = ({ data, onBack }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "radial-gradient(circle at center, #0F2A44 0%, #060D17 100%)",
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

      <Container maxWidth="xl" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
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
            }}
          >
            TẬP THỂ XUẤT SẮC
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

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                bgcolor: "rgba(15, 42, 68, 0.5)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                boxShadow: "0 50px 100px rgba(0,0,0,0.8)",
                maxWidth: "1200px",
                width: "100%",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "5px",
                  background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
                  zIndex: 10,
                },
              }}
            >
              {/* Decorative corner */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  width: 30,
                  height: 30,
                  borderBottom: "2px solid rgba(212, 175, 55, 0.4)",
                  borderRight: "2px solid rgba(212, 175, 55, 0.4)",
                  zIndex: 5,
                }}
              />
              <Box sx={{ width: { xs: "100%", md: "50%" }, position: "relative" }}>
                <CardMedia
                  component="img"
                  image={data?.imageUrl}
                  alt={data?.name}
                  sx={{
                    height: "100%",
                    minHeight: 500,
                    filter: "brightness(0.9)",
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  width: { xs: "100%", md: "50%" },
                  p: 6,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "#D4AF37", mb: 3 }}>
                  <TrophyIcon sx={{ fontSize: 40 }} />
                  <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 700, fontSize: "1rem" }}>
                    {data?.badge || "DANH HIỆU CAO QUÝ"}
                  </Typography>
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    background: "linear-gradient(to bottom, #FCF6BA, #BF953F)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    fontSize: "4rem",
                    fontFamily: '"Cormorant Garamond", serif',
                    lineHeight: 1.1,
                  }}
                >
                  {data?.name}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    mb: 4,
                    fontStyle: "italic",
                    fontFamily: '"Cormorant Garamond", serif',
                    opacity: 0.9,
                  }}
                >
                  {data?.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontStyle: "italic",
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "1.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  “{data?.description}”
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OutstandingTeam;
