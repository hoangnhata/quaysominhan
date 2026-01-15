import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Grid,
  Button,
  Divider,
  Stack,
  Chip,
  Container,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Fullscreen,
  FullscreenExit,
  EmojiEvents,
  Stars,
  EmojiEmotions,
  Timer,
  Person,
  MilitaryTech,
  PlayArrow,
  LocalHospital,
  WorkspacePremium,
  NavigateBefore,
  NavigateNext,
  HealthAndSafety,
  MedicalServices,
} from "@mui/icons-material";
import axios from "axios";
import confetti from "canvas-confetti";

const API_BASE_URL = "http://localhost:8080/api/lucky-draw";

// Medical Style Colors - Premium Healthcare Theme
const COLORS = {
  primary: "#00796b", // Deep Teal
  secondary: "#00acc1", // Medical Blue-Cyan
  accent: "#ff9800", // Warm Orange for highlights
  background: "#f0f4f8", // Soft Medical Blue-Grey
  surface: "rgba(255, 255, 255, 0.9)",
  lightTeal: "#e0f2f1",
  medicalRed: "#ef5350",
  white: "#ffffff",
  gold: "#ffd700",
  textPrimary: "#1a2a3a",
  textSecondary: "#455a64",
  lightBlue: "#e3f2fd",
  darkTeal: "#004d40",
};

const LuckyDrawPage = () => {
  const [participants, setParticipants] = useState([]);
  const [gameState, setGameState] = useState("IDLE"); // 'IDLE', 'SPINNING', 'WINNER'
  const [winner, setWinner] = useState(null);
  const [recentWinners, setRecentWinners] = useState([]);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [drawingPrize, setDrawingPrize] = useState(null);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const spinInterval = useRef(null);
  const containerRef = useRef(null);
  const gameStateRef = useRef("IDLE");
  const winnersListRef = useRef(null);

  // Audio refs - Updated with more stable URLs and better error handling
  const spinAudio = useRef(
    new Audio("https://www.soundjay.com/buttons/button-37a.mp3")
  );
  const winAudio = useRef(
    new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3")
  );

  // Auto-scroll logic for winners list
  useEffect(() => {
    const scrollContainer = winnersListRef.current;
    if (!scrollContainer || recentWinners.length <= 5) return;

    // Khi có người mới, cuộn lên đầu để hiện người mới nhất
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });

    const scrollStep = () => {
      if (gameStateRef.current !== "IDLE") return;

      const isAtBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 20;

      if (isAtBottom) {
        // Nếu đã hiện hết, đợi 4s rồi quay lại từ đầu
        setTimeout(() => {
          if (scrollContainer)
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        }, 4000);
      } else {
        // Cuộn xuống để hiện người tiếp theo (khoảng cách tương đương 1 thẻ + margin)
        scrollContainer.scrollBy({ top: 140, behavior: "smooth" });
      }
    };

    const interval = setInterval(scrollStep, 3500); // 3.5 giây chuyển một lần
    return () => clearInterval(interval);
  }, [recentWinners.length, gameState]);

  // Define logic variables for compatibility during migration
  const isSpinning = gameState === "SPINNING";
  const showOverlay = gameState === "WINNER";

  // Keep ref in sync for websocket closure
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    fetchInitialData();
    spinAudio.current.loop = true;

    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
      spinAudio.current.pause();
      winAudio.current.pause();
    };
  }, []);

  useEffect(() => {
    if (prizes.length > 0 && prizeIndex >= prizes.length) {
      setPrizeIndex(0);
    }
  }, [prizes]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [partRes, prizeRes, winnersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/participants`),
        axios.get(`${API_BASE_URL}/prizes`),
        axios.get(`${API_BASE_URL}/recent-winners`),
      ]);
      setParticipants(partRes.data);
      setPrizes(prizeRes.data);
      setRecentWinners(winnersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDraw = async (prizeId) => {
    if (gameState !== "IDLE") return;
    if (participants.length === 0) {
      alert("Danh sách nhân viên trống, không thể quay số!");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/draw/${prizeId}`
      );
      handleDrawResult(response.data);
    } catch (error) {
      alert(error.response?.data || "Lỗi khi thực hiện quay số");
    }
  };

  const handleDrawResult = (result) => {
    // Đảm bảo kết quả có thông tin thời gian nếu server không trả về ngay
    const drawData = {
      ...result,
      drawTime: result.drawTime || new Date().toISOString(),
    };
    setDrawingPrize(drawData.prize);
    setWinner(drawData);
    startSpinningAnimation(drawData);
  };

  const handleRedraw = async () => {
    if (!winner) return;

    try {
      // Gọi API xóa kết quả. Lưu ý: Backend cần cấu hình CORS cho phép DELETE
      await axios.delete(`${API_BASE_URL}/admin/draw/${winner.id}`);

      // Xóa khỏi danh sách hiển thị hiện tại
      setRecentWinners((prev) => prev.filter((w) => w.id !== winner.id));

      // Quay về trạng thái chuẩn bị
      setGameState("IDLE");
      setWinner(null);
      setDrawingPrize(null);

      // Tải lại dữ liệu (số lượng quà, v.v.)
      fetchInitialData();
    } catch (error) {
      console.error("Redraw error:", error);
      // Ngay cả khi lỗi API xóa (có thể do CORS), ta vẫn nên cho phép UI quay lại để không bị kẹt
      // Nhưng cảnh báo người dùng kiểm tra lại backend
      alert(
        "Lỗi kết nối máy chủ khi hủy kết quả. Vui lòng kiểm tra lại quyền Admin hoặc cấu hình CORS trên Backend!"
      );

      // Reset UI để admin có thể thao tác tiếp
      setGameState("IDLE");
      setWinner(null);
      setDrawingPrize(null);
      fetchInitialData();
    }
  };

  const closeOverlay = () => {
    winAudio.current.pause();
    winAudio.current.currentTime = 0;
    setGameState("IDLE");
    setWinner(null);
    setDrawingPrize(null);
    fetchInitialData();
  };

  const startSpinningAnimation = (result) => {
    setGameState("SPINNING");

    // Play sound with error handling
    try {
      spinAudio.current.currentTime = 0;
      spinAudio.current
        .play()
        .catch((err) => console.warn("Audio play blocked:", err));
    } catch (err) {
      console.warn("Audio error:", err);
    }

    let duration = 8000; // Tăng thời gian quay để tạo kịch tính
    let startTime = Date.now();
    let speed = 20; // Tốc độ bắt đầu (ms mỗi lần chuyển)

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      // Hiệu ứng giảm tốc (Easing Out)
      const currentSpeed = speed + progress * 300;

      setCurrentAvatarIndex(
        (prev) => (prev + 1) % Math.max(participants.length, 1)
      );

      if (elapsed < duration) {
        spinInterval.current = setTimeout(animate, currentSpeed);
      } else {
        try {
          spinAudio.current.pause();
        } catch (err) {}

        const winnerIndex = participants.findIndex(
          (p) => p.id === result.participant.id
        );
        if (winnerIndex !== -1) setCurrentAvatarIndex(winnerIndex);

        // HIỆN OVERLAY CHIẾN THẮNG
        setGameState("WINNER");

        // Play victory sound
        try {
          winAudio.current.currentTime = 0;
          winAudio.current
            .play()
            .catch((err) => console.warn("Victory sound blocked:", err));
        } catch (err) {
          console.warn("Victory audio error:", err);
        }

        triggerConfetti();

        // CẬP NHẬT DANH SÁCH MAY MẮN NGAY LÚC NÀY
        setRecentWinners((prev) => {
          if (prev.find((w) => w.id === result.id)) return prev;
          return [result, ...prev];
        });
      }
    };

    animate();
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 2000,
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentParticipant = participants[currentAvatarIndex] || null;

  if (loading) {
    return (
      <Backdrop
        open={true}
        sx={{
          color: COLORS.primary,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" fontWeight={600}>
          Đang tải dữ liệu...
        </Typography>
      </Backdrop>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.lightTeal} 100%)`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        color: COLORS.textPrimary,
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 2.5,
          px: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid rgba(0, 137, 123, 0.1)`,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            component="img"
            src="/logo.jpg"
            sx={{
              height: 70,
              width: 70,
              objectFit: "contain",
              borderRadius: "50%",
              border: `2px solid ${COLORS.primary}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/hospital.png";
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: COLORS.primary,
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              BỆNH VIỆN MINH AN
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: COLORS.textSecondary,
                fontWeight: 600,
                mt: 0.5,
                opacity: 0.8,
              }}
            >
              Chương trình quay số tri ân 2026
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={toggleFullscreen}
          sx={{
            color: COLORS.primary,
            bgcolor: COLORS.lightBlue,
            "&:hover": { bgcolor: "#b3e5fc" },
          }}
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Grid container sx={{ flexGrow: 1, overflow: "hidden" }}>
        {/* LEFT SIDE: DRAWING AREA */}
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 4,
            position: "relative",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              {gameState === "IDLE" ? (
                // PRIZES LIST
                <Box
                  component={motion.div}
                  key="prizes"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  sx={{ width: "100%", textAlign: "center" }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 6,
                      fontWeight: 800,
                      color: COLORS.primary,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    DANH SÁCH GIẢI THƯỞNG
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -10,
                        left: "20%",
                        right: "20%",
                        height: 4,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
                      }}
                    />
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      maxWidth: 1300,
                      mx: "auto",
                      position: "relative",
                      px: 8,
                    }}
                  >
                    {/* Left Navigation */}
                    <Box sx={{ position: "absolute", left: 0 }}>
                      <IconButton
                        disabled={prizeIndex === 0}
                        onClick={() =>
                          setPrizeIndex((prev) => Math.max(0, prev - 1))
                        }
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: COLORS.surface,
                          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                          border: `1px solid ${COLORS.lightBlue}`,
                          color: COLORS.primary,
                          "&:hover": {
                            bgcolor: COLORS.lightTeal,
                            transform: "scale(1.1)",
                          },
                          "&.Mui-disabled": { opacity: 0.3 },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <NavigateBefore sx={{ fontSize: 35 }} />
                      </IconButton>
                    </Box>

                    {/* Prizes Container with AnimatePresence */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 5,
                        minHeight: 480,
                        alignItems: "center",
                      }}
                    >
                      <AnimatePresence mode="popLayout">
                        {prizes.slice(prizeIndex, prizeIndex + 2).map((p) => (
                          <Box
                            key={p.id}
                            component={motion.div}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 0,
                                width: 420,
                                borderRadius: 4,
                                bgcolor: COLORS.surface,
                                border: `1px solid rgba(0, 137, 123, 0.1)`,
                                boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                transition:
                                  "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                "&:hover": {
                                  transform: "translateY(-15px)",
                                  boxShadow: `0 40px 80px rgba(0, 137, 123, 0.18)`,
                                  "& .prize-image": {
                                    transform: "scale(1.05)",
                                  },
                                },
                              }}
                            >
                              {/* Top Banner with Large Image */}
                              <Box
                                sx={{
                                  height: 280,
                                  bgcolor: "#fcfdfe",
                                  position: "relative",
                                  overflow: "hidden",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderBottom: `1px solid ${COLORS.lightBlue}`,
                                }}
                              >
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                    zIndex: 10,
                                  }}
                                >
                                  <Chip
                                    label={`SỐ LƯỢNG CÒN LẠI: ${p.remainingQuantity}`}
                                    sx={{
                                      bgcolor: COLORS.primary,
                                      color: "#fff",
                                      fontWeight: 900,
                                      borderRadius: 1,
                                      px: 1,
                                      fontSize: "0.75rem",
                                      boxShadow:
                                        "0 4px 12px rgba(0,137,123,0.3)",
                                    }}
                                  />
                                </Box>

                                {p.imageUrl ? (
                                  <Box
                                    component="img"
                                    className="prize-image"
                                    src={p.imageUrl}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                      p: 2,
                                      transition: "transform 0.6s ease",
                                    }}
                                  />
                                ) : (
                                  <Box
                                    className="prize-image"
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      bgcolor: COLORS.lightBlue,
                                      transition: "transform 0.6s ease",
                                    }}
                                  >
                                    <EmojiEvents
                                      sx={{
                                        fontSize: 120,
                                        color: COLORS.primary,
                                        opacity: 0.8,
                                      }}
                                    />
                                  </Box>
                                )}
                              </Box>

                              {/* Content Section */}
                              <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    fontWeight: 900,
                                    mb: 1.5,
                                    color: COLORS.textPrimary,
                                    letterSpacing: -1,
                                  }}
                                >
                                  {p.name}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: COLORS.textSecondary,
                                    mb: 4,
                                    fontWeight: 500,
                                    opacity: 0.8,
                                  }}
                                >
                                  Phần quà tri ân đặc biệt dành cho nhân viên
                                  xuất sắc
                                </Typography>

                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="large"
                                  startIcon={
                                    <PlayArrow sx={{ fontSize: 30 }} />
                                  }
                                  disabled={p.remainingQuantity <= 0}
                                  onClick={() => handleStartDraw(p.id)}
                                  component={motion.button}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  sx={{
                                    borderRadius: 2,
                                    bgcolor: COLORS.primary,
                                    fontWeight: 900,
                                    py: 2.5,
                                    fontSize: "1.3rem",
                                    boxShadow: `0 12px 30px rgba(0, 137, 123, 0.25)`,
                                    textTransform: "uppercase",
                                    letterSpacing: 2,
                                    "&:hover": {
                                      bgcolor: COLORS.darkTeal,
                                    },
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  BẮT ĐẦU QUAY SỐ
                                </Button>
                              </Box>
                            </Paper>
                          </Box>
                        ))}
                      </AnimatePresence>
                    </Box>

                    {/* Right Navigation */}
                    <Box sx={{ position: "absolute", right: 0 }}>
                      <IconButton
                        disabled={
                          prizes.length <= 2 || prizeIndex + 2 >= prizes.length
                        }
                        onClick={() =>
                          setPrizeIndex((prev) =>
                            Math.min(prizes.length - 2, prev + 1)
                          )
                        }
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: COLORS.surface,
                          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                          border: `1px solid ${COLORS.lightBlue}`,
                          color: COLORS.primary,
                          "&:hover": {
                            bgcolor: COLORS.lightTeal,
                            transform: "scale(1.1)",
                          },
                          "&.Mui-disabled": { opacity: 0.3 },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <NavigateNext fontSize="large" sx={{ fontSize: 35 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Dot Indicators */}
                  {prizes.length > 2 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1.5,
                        mt: 4,
                      }}
                    >
                      {Array.from({
                        length: Math.max(0, prizes.length - 1),
                      }).map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: prizeIndex === i ? 24 : 10,
                            height: 10,
                            borderRadius: 5,
                            bgcolor:
                              prizeIndex === i
                                ? COLORS.primary
                                : COLORS.lightBlue,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => setPrizeIndex(i)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                // SPINNING WHEEL AREA
                <Box
                  component={motion.div}
                  key="spinning"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  sx={{ textAlign: "center", position: "relative" }}
                >
                  {/* Decorative Medical Background Elements */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -100,
                      left: -200,
                      opacity: 0.05,
                      transform: "rotate(-15deg)",
                    }}
                  >
                    <MedicalServices sx={{ fontSize: 400 }} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -100,
                      right: -200,
                      opacity: 0.05,
                      transform: "rotate(15deg)",
                    }}
                  >
                    <HealthAndSafety sx={{ fontSize: 400 }} />
                  </Box>

                  {drawingPrize && (
                    <Box sx={{ mb: 6 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: COLORS.textSecondary,
                          fontWeight: 800,
                          mb: 2,
                          textTransform: "uppercase",
                          letterSpacing: 6,
                        }}
                      >
                        Hành trình tìm kiếm chủ nhân
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 8,
                          py: 2.5,
                          borderRadius: "50px",
                          background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary})`,
                          color: COLORS.white,
                          boxShadow: "0 20px 40px rgba(0,121,107,0.3)",
                          border: "4px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        <EmojiEvents
                          sx={{ mr: 2, fontSize: 45, color: COLORS.gold }}
                        />
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                          }}
                        >
                          {drawingPrize.name}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                    }}
                  >
                    {/* LEFT: WHEEL & NAME */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: { xs: 400, md: 550 },
                          height: { xs: 400, md: 550 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Outer Glow Ring */}
                        <Box
                          sx={{
                            position: "absolute",
                            width: "110%",
                            height: "110%",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${COLORS.secondary}22 0%, transparent 70%)`,
                            animation: "pulse 2s ease-in-out infinite",
                          }}
                        />

                        {/* Main Spinning Circle */}
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            p: 1.5,
                            background: `conic-gradient(from 0deg, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.lightTeal}, ${COLORS.primary})`,
                            boxShadow: `0 0 100px ${COLORS.primary}44, inset 0 0 50px rgba(0,0,0,0.1)`,
                            animation: isSpinning
                              ? "spin 1s linear infinite"
                              : "spin 20s linear infinite",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "10px solid #fff",
                          }}
                        >
                          <Box
                            sx={{
                              width: "90%",
                              height: "90%",
                              bgcolor: "#fff",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            }}
                          >
                            <Avatar
                              src={currentParticipant?.imageUrl}
                              sx={{
                                width: "100%",
                                height: "100%",
                                fontSize: "15rem",
                                fontWeight: 900,
                                bgcolor: COLORS.lightTeal,
                                color: COLORS.primary,
                                filter: isSpinning ? "blur(3px)" : "none",
                                transition: "filter 0.3s ease",
                              }}
                            >
                              {currentParticipant?.name?.charAt(0)}
                            </Avatar>
                          </Box>
                        </Box>

                        {/* Fixed Pointer */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -30,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 20,
                            filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.2))",
                          }}
                        >
                          <LocalHospital
                            sx={{ fontSize: 100, color: COLORS.medicalRed }}
                          />
                          <Box
                            sx={{
                              width: 0,
                              height: 0,
                              borderLeft: "20px solid transparent",
                              borderRight: "20px solid transparent",
                              borderTop: `30px solid ${COLORS.medicalRed}`,
                              mx: "auto",
                              mt: -2,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Name display below wheel */}
                      <Box
                        sx={{
                          mt: 4,
                          minHeight: 120,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 950,
                            color: COLORS.primary,
                            textShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            fontSize: "3.5rem",
                          }}
                        >
                          {currentParticipant?.name || "..."}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: COLORS.textSecondary,
                            opacity: 0.8,
                            mt: 1,
                          }}
                        >
                          {currentParticipant?.email || ""}
                        </Typography>
                      </Box>
                    </Box>

                    {/* RIGHT: SCANNING STATUS */}
                    <Box
                      sx={{
                        width: 400,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 4,
                        borderRadius: 6,
                        bgcolor: "rgba(255,255,255,0.4)",
                        border: `2px solid rgba(0, 121, 107, 0.1)`,
                        backdropFilter: "blur(5px)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Radar Animation Background */}
                      <Box
                        sx={{
                          position: "relative",
                          width: 200,
                          height: 200,
                          mb: 4,
                        }}
                      >
                        {[1, 2, 3].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: i * 60,
                              height: i * 60,
                              borderRadius: "50%",
                              border: `1px solid ${COLORS.primary}44`,
                              animation: `pulse ${
                                1.5 + i * 0.5
                              }s ease-out infinite`,
                            }}
                          />
                        ))}
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: `conic-gradient(from 0deg, transparent, ${COLORS.primary}22, ${COLORS.primary})`,
                            animation: "spin 2s linear infinite",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: COLORS.primary,
                          }}
                        >
                          <HealthAndSafety sx={{ fontSize: 60 }} />
                        </Box>
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          color: COLORS.primary,
                          fontWeight: 900,
                          letterSpacing: 4,
                          textTransform: "uppercase",
                          textAlign: "center",
                          mb: 3,
                        }}
                      >
                        Hệ thống đang quét
                      </Typography>

                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: `${COLORS.primary}15`,
                          borderRadius: 4,
                          overflow: "hidden",
                          position: "relative",
                          border: `1px solid ${COLORS.primary}22`,
                          mb: 4,
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "40%",
                            height: "100%",
                            background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, transparent)`,
                            animation:
                              "scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                          }}
                        />
                      </Box>

                      <Stack spacing={1.5} sx={{ width: "100%" }}>
                        {[
                          "PHÂN TÍCH NHÂN SỰ...",
                          "TRUY XUẤT DỮ LIỆU...",
                          "KIỂM TRA ĐIỀU KIỆN...",
                          "ĐANG CHỌN ỨNG VIÊN...",
                        ].map((text, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              opacity: 0.6,
                              animation: `pulse ${
                                1 + idx * 0.3
                              }s ease-in-out infinite`,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: COLORS.primary,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 800, letterSpacing: 1 }}
                            >
                              {text}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              )}
            </AnimatePresence>
          </Box>

          {/* FOOTER SLOGAN */}
          <Box
            sx={{
              mt: "auto",
              p: 3,
              borderRadius: 8,
              border: `2px dashed rgba(0, 137, 123, 0.2)`,
              textAlign: "center",
              maxWidth: 800,
              mx: "auto",
              width: "100%",
              bgcolor: "rgba(255,255,255,0.5)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: COLORS.primary,
                fontWeight: 800,
                letterSpacing: 1.5,
              }}
            >
              “BỆNH VIỆN MINH AN – LUÔN TẬN TÂM VÌ SỨC KHỎE CỦA BẠN”
            </Typography>
          </Box>
        </Grid>

        {/* RIGHT SIDE: WINNERS LIST (SIDEBAR) */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgba(255, 255, 255, 0.4)",
            borderLeft: `1px solid rgba(0, 137, 123, 0.1)`,
          }}
        >
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar
              sx={{
                bgcolor: COLORS.primary,
                width: 56,
                height: 56,
                boxShadow: `0 4px 15px rgba(0, 137, 123, 0.2)`,
              }}
            >
              <WorkspacePremium fontSize="large" sx={{ color: COLORS.gold }} />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: COLORS.primary,
                letterSpacing: -0.5,
              }}
            >
              DANH SÁCH MAY MẮN
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box
            ref={winnersListRef}
            sx={{
              height: 700, // 5 thẻ * 140px (120px height + 20px margin)
              overflowY: "hidden",
              pr: 1,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { width: 0 },
            }}
          >
            <AnimatePresence initial={false}>
              {recentWinners.map((win, idx) => (
                <Paper
                  key={win.id}
                  component={motion.div}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  sx={{
                    p: 2.5,
                    mb: 2.5,
                    height: 120, // Cố định chiều cao thẻ để tính toán chính xác
                    borderRadius: 5,
                    bgcolor: idx === 0 ? COLORS.lightTeal : COLORS.surface,
                    border:
                      idx === 0
                        ? `2px solid ${COLORS.primary}`
                        : `1px solid rgba(0, 137, 123, 0.08)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow:
                      idx === 0
                        ? "0 12px 25px rgba(0, 137, 123, 0.12)"
                        : "0 4px 12px rgba(0,0,0,0.02)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Avatar
                    src={win.participant.imageUrl}
                    sx={{
                      width: 56,
                      height: 56,
                      border:
                        idx === 0
                          ? `3px solid ${COLORS.primary}`
                          : `2px solid ${COLORS.lightBlue}`,
                    }}
                  >
                    {win.participant.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: COLORS.textPrimary,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {win.participant.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.textSecondary,
                        mt: 0.2,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.8rem",
                      }}
                    >
                      {win.participant.email}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Chip
                        icon={
                          <EmojiEvents
                            sx={{
                              fontSize: "13px !important",
                              color: COLORS.gold,
                            }}
                          />
                        }
                        label={win.prize.name}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          bgcolor: "rgba(0, 137, 123, 0.1)",
                          color: COLORS.primary,
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </AnimatePresence>
            {recentWinners.length === 0 && (
              <Box sx={{ textAlign: "center", mt: 15, opacity: 0.3 }}>
                <Person sx={{ fontSize: 100, color: COLORS.primary, mb: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  Chưa có ai trúng giải
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* WINNER OVERLAY (MODERN PREMIUM STYLE) */}
      <AnimatePresence>
        {gameState === "WINNER" && winner && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.85)", // Nền tối hơn để nổi bật khung
              backdropFilter: "blur(15px)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Lớp khung trang trí ngoài cùng */}
              <Box
                sx={{
                  position: "relative",
                  p: 1,
                  borderRadius: 14,
                  background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.gold}, ${COLORS.primary})`,
                  backgroundSize: "300% 300%",
                  animation: "gradientMove 3s ease infinite",
                  boxShadow: `0 0 100px ${COLORS.primary}88`,
                  mb: 5,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 8 },
                    borderRadius: 13,
                    bgcolor: "#fff",
                    maxWidth: 1100,
                    width: "92vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative Background Icon */}
                  <EmojiEvents
                    sx={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      fontSize: 300,
                      color: COLORS.primary,
                      opacity: 0.03,
                      transform: "rotate(15deg)",
                    }}
                  />

                  <Box sx={{ textAlign: "center", zIndex: 1 }}>
                    <LocalHospital
                      sx={{ fontSize: 80, color: COLORS.medicalRed, mb: 2 }}
                    />
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 900,
                        color: COLORS.primary,
                        mb: 1,
                        letterSpacing: -2,
                        fontSize: { xs: "3.5rem", md: "5.5rem" },
                        textShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      }}
                    >
                      XIN CHÚC MỪNG!
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        color: COLORS.textSecondary,
                        fontWeight: 700,
                        letterSpacing: 8,
                        textTransform: "uppercase",
                        opacity: 0.8,
                        mb: 6,
                      }}
                    >
                      Nhân viên may mắn trúng giải
                    </Typography>
                  </Box>

                  <Grid
                    container
                    spacing={8}
                    alignItems="center"
                    sx={{ zIndex: 1 }}
                  >
                    <Grid item xs={12} md={5.5}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          pt: "100%", // 1:1 Aspect Ratio
                          borderRadius: 8,
                          overflow: "hidden",
                          boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                          border: `12px solid ${COLORS.lightTeal}`,
                        }}
                      >
                        {winner.participant.imageUrl ? (
                          <Box
                            component="img"
                            src={winner.participant.imageUrl}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              bgcolor: COLORS.lightBlue,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Person
                              sx={{ fontSize: 200, color: COLORS.primary }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6.5} sx={{ textAlign: "left" }}>
                      <Stack spacing={4}>
                        <Box>
                          <Typography
                            variant="h2"
                            sx={{
                              fontWeight: 850,
                              color: COLORS.textPrimary,
                              lineHeight: 1.1,
                              fontSize: { xs: "3rem", md: "4.5rem" },
                              mb: 1,
                            }}
                          >
                            {winner.participant.name}
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{
                              color: COLORS.secondary,
                              fontWeight: 700,
                              opacity: 0.9,
                            }}
                          >
                            {winner.participant.email}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            background: `linear-gradient(135deg, ${COLORS.lightTeal} 0%, #fff 100%)`,
                            p: 5,
                            borderRadius: 10,
                            border: `4px dashed ${COLORS.primary}`,
                            position: "relative",
                            boxShadow: "inset 0 0 30px rgba(0,121,107,0.05)",
                          }}
                        >
                          <Chip
                            icon={
                              <EmojiEvents
                                sx={{ color: `${COLORS.gold} !important` }}
                              />
                            }
                            label="PHẦN THƯỞNG"
                            sx={{
                              position: "absolute",
                              top: -20,
                              left: 30,
                              bgcolor: COLORS.primary,
                              color: "#fff",
                              fontWeight: 900,
                              px: 2,
                              height: 40,
                              fontSize: "1rem",
                              boxShadow: "0 8px 20px rgba(0,121,107,0.3)",
                            }}
                          />
                          <Typography
                            variant="h2"
                            sx={{
                              fontWeight: 950,
                              color: COLORS.darkTeal,
                              textTransform: "uppercase",
                              mt: 1,
                              fontSize: { xs: "2.5rem", md: "4rem" },
                            }}
                          >
                            {winner.prize.name}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Typography
                    variant="h5"
                    sx={{
                      mt: 4,
                      color: COLORS.textSecondary,
                      fontWeight: 800,
                      fontStyle: "italic",
                      opacity: 0.7,
                      textAlign: "center",
                    }}
                  >
                    🎉 Chúc mừng bạn đã trúng giải trong sự kiện tri ân hôm nay!
                  </Typography>
                </Paper>
              </Box>

              <Stack direction="row" spacing={3}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleRedraw}
                  sx={{
                    px: 6,
                    py: 2.5,
                    borderRadius: 10,
                    borderColor: COLORS.medicalRed,
                    color: COLORS.medicalRed,
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    borderWidth: 3,
                    textTransform: "none",
                    "&:hover": {
                      borderWidth: 3,
                      bgcolor: "rgba(239, 83, 80, 0.05)",
                      borderColor: COLORS.medicalRed,
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Vắng mặt (Quay lại)
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  onClick={closeOverlay}
                  sx={{
                    px: 10,
                    py: 2.5,
                    borderRadius: 10,
                    bgcolor: COLORS.primary,
                    color: "#fff",
                    fontSize: "1.6rem",
                    fontWeight: 950,
                    textTransform: "none",
                    boxShadow: `0 20px 50px ${COLORS.primary}66`,
                    "&:hover": {
                      bgcolor: COLORS.darkTeal,
                      transform: "translateY(-3px)",
                      boxShadow: `0 30px 60px ${COLORS.primary}88`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Xác nhận & Tiếp tục
                </Button>
              </Stack>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.5; }
          }
          @keyframes scan {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/bevietnampro/v11/QdB7Fe9Q07jtZYR6eJAn7S9z_H_XPhOf.woff2) format('woff2');
            font-display: swap;
          }
        `}
      </style>
    </Box>
  );
};

export default LuckyDrawPage;
