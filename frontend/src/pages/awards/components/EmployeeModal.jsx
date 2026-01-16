import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Fade,
} from "@mui/material";
import { Close, Stars, HomeRepairService } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 650 },
  bgcolor: "#0B1F3A",
  border: "1px solid #D4AF37",
  boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
  p: 0,
  borderRadius: 0,
  overflow: "hidden",
  outline: "none",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    border: "1px solid rgba(212, 175, 55, 0.2)",
    pointerEvents: "none",
    zIndex: 1,
  },
};

const EmployeeModal = ({ open, handleClose, employee }) => {
  if (!employee) return null;

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={style}>
          <Box
            sx={{
              position: "relative",
              height: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle at center, rgba(212, 175, 55, 0.2) 0%, transparent 80%)",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 20,
                top: 20,
                color: "white",
                zIndex: 10,
                bgcolor: "rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "rgba(212, 175, 55, 0.4)" },
              }}
            >
              <Close />
            </IconButton>

            <Avatar
              src={employee.image}
              sx={{
                width: 180,
                height: 220,
                borderRadius: "4px",
                border: "2px solid #D4AF37",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                zIndex: 2,
              }}
            />
          </Box>

          <Box
            sx={{
              p: 6,
              pt: 2,
              textAlign: "center",
              color: "white",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(212, 175, 55, 0.15)",
                color: "#F5D88C",
                px: 3,
                py: 0.8,
                borderRadius: 0,
                mb: 3,
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              {employee.badge}
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: "#D4AF37",
                fontFamily: '"Cormorant Garamond", serif',
                letterSpacing: "0.02em",
              }}
            >
              {employee.name}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.7)",
                mb: 4,
                fontWeight: 500,
                fontStyle: "italic",
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "1.4rem",
              }}
            >
              {employee.department}
            </Typography>

            <Box
              sx={{
                p: 4,
                bgcolor: "rgba(255,255,255,0.03)",
                borderRadius: 0,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.05)",
                position: "relative",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.95)",
                  fontWeight: 400,
                  fontSize: "1.2rem",
                  fontFamily: '"Cormorant Garamond", serif',
                }}
              >
                “{employee.description}”
              </Typography>
            </Box>

            <Box sx={{ mt: 4, opacity: 0.5 }}>
              <Typography
                variant="caption"
                sx={{ letterSpacing: 3, textTransform: "uppercase" }}
              >
                Bệnh viện Minh An
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EmployeeModal;
