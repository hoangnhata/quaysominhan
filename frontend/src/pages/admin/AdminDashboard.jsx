import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  CloudUpload,
  Add,
  Delete,
  Edit,
  PlayArrow,
  People,
  EmojiEvents,
  RestartAlt,
  Save,
  Search,
  CheckCircle,
  FileDownload,
  HistoryEdu,
  WorkspacePremium,
} from "@mui/icons-material";
import axios from "axios";
import * as XLSX from "xlsx";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:8080/api/lucky-draw";
const HONORS_API_URL = "http://localhost:8080/api/honors";

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [honors, setHonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyNonWinners, setShowOnlyNonWinners] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  
  const [openPrizeDialog, setOpenPrizeDialog] = useState(false);
  const [currentPrize, setCurrentPrize] = useState({
    name: "",
    totalQuantity: 0,
    imageUrl: "",
  });

  const [openParticipantDialog, setOpenParticipantDialog] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState({
    name: "",
    phone: "",
    email: "", // Department
  });

  const [openHonorDialog, setOpenHonorDialog] = useState(false);
  const [currentHonor, setCurrentHonor] = useState({
    name: "",
    title: "",
    category: "nhanVienXuatSac",
    description: "",
    imageUrl: "",
    badge: "",
  });

  const categories = {
    tapTheXuatSac: "Tập thể xuất sắc",
    truongKhoaXuatSac: "Trưởng khoa xuất sắc",
    nhanVienXuatSac: "Nhân viên xuất sắc",
    nhanVienCongHien: "Nhân viên cống hiến",
  };

  const defaultBadges = {
    tapTheXuatSac: "🏆 TẬP THỂ XUẤT SẮC",
    truongKhoaXuatSac: "⭐ TRƯỞNG KHOA XUẤT SẮC",
    nhanVienXuatSac: "🏅 NHÂN VIÊN XUẤT SẮC",
    nhanVienCongHien: "🤍 NHÂN VIÊN CỐNG HIẾN",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partRes, prizeRes, winnersRes, honorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/participants`),
        axios.get(`${API_BASE_URL}/prizes`),
        axios.get(`${API_BASE_URL}/recent-winners`),
        axios.get(HONORS_API_URL),
      ]);
      setParticipants(partRes.data);
      setPrizes(prizeRes.data);
      setWinners(winnersRes.data);
      setHonors(honorsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      try {
        setLoading(true);
        for (const row of data) {
          await axios.post(`${API_BASE_URL}/check-in`, {
            name: row["Tên NV"] || row["Name"],
            phone: row["Phone"] ? String(row["Phone"]) : ("AUTO-" + Math.random().toString(36).substring(7)),
            email: row["Phòng"] || row["Department"] || "N/A",
            checkInCode: row["Mã NV"] ? String(row["Mã NV"]) : null,
          });
        }
        enqueueSnackbar(`Đã nhập thành công ${data.length} nhân viên`, { variant: "success" });
        fetchData();
      } catch (err) {
        enqueueSnackbar("Lỗi khi nhập dữ liệu từ Excel", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleHonorExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const mapCategory = (val) => {
        if (!val) return "nhanVienXuatSac";
        const v = String(val).toLowerCase().trim();
        if (v.includes("tập thể") || v === "tapthexuatsac") return "tapTheXuatSac";
        if (v.includes("trưởng khoa") || v === "truongkhoaxuatsac") return "truongKhoaXuatSac";
        if (v.includes("cống hiến") || v === "nhanvienconghien") return "nhanVienCongHien";
        if (v.includes("nhân viên") || v.includes("nhanvien") || v === "nhanvienxuatsac") return "nhanVienXuatSac";
        return "nhanVienXuatSac"; // Mặc định
      };

      try {
        setLoading(true);
        for (const row of data) {
          // Kiểm tra nhiều tiêu đề cột khác nhau cho linh hoạt
          const categoryRaw = row["Phân loại"] || row["Loại"] || row["Category"] || row["Type"];
          const category = mapCategory(categoryRaw);
          const badge = row["Huy hiệu"] || row["Badge"] || defaultBadges[category] || "";
          
          await axios.post(HONORS_API_URL, {
            name: row["Tên"] || row["Name"] || row["Họ tên"] || row["Họ và Tên"],
            title: row["Chức vụ"] || row["Title"] || row["Tiêu đề"] || "",
            category: category,
            description: row["Mô tả"] || row["Description"] || "",
            badge: badge,
          });
        }
        enqueueSnackbar(`Đã nhập thành công ${data.length} danh hiệu`, { variant: "success" });
        fetchData();
      } catch (err) {
        enqueueSnackbar("Lỗi khi nhập dữ liệu vinh danh từ Excel", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      enqueueSnackbar("Đang tải ảnh lên...", { variant: "info" });
      const res = await axios.post(`${API_BASE_URL}/admin/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (type === "participant") {
        setCurrentParticipant({ ...currentParticipant, imageUrl: res.data.url });
      } else if (type === "prize") {
        setCurrentPrize({ ...currentPrize, imageUrl: res.data.url });
      } else if (type === "honor") {
        setCurrentHonor({ ...currentHonor, imageUrl: res.data.url });
      }
      enqueueSnackbar("Tải ảnh thành công", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi tải ảnh", { variant: "error" });
    }
  };

  const handleDraw = async (prizeId) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/draw/${prizeId}`);
      enqueueSnackbar("Bắt đầu quay số!", { variant: "info" });
      fetchData();
    } catch (err) {
      enqueueSnackbar(err.response?.data || "Lỗi khi quay số", { variant: "error" });
    }
  };

  const handleResetSystem = async () => {
    if (!window.confirm("BẠN CÓ CHẮC CHẮN MUỐN RESET TOÀN BỘ HỆ THỐNG? Thao tác này sẽ xóa sạch lịch sử trúng thưởng và đặt lại số lượng quà.")) return;
    try {
      await axios.post(`${API_BASE_URL}/admin/reset`);
      enqueueSnackbar("Đã reset toàn bộ hệ thống", { variant: "warning" });
      fetchData();
    } catch (err) {
      enqueueSnackbar("Lỗi khi reset hệ thống", { variant: "error" });
    }
  };

  const handleExportWinners = () => {
    if (winners.length === 0) {
      enqueueSnackbar("Chưa có danh sách trúng giải để xuất!", { variant: "warning" });
      return;
    }

    const exportData = winners.map((win, index) => ({
      "STT": index + 1,
      "Tên Nhân Viên": win.participant.name,
      "Mã NV": win.participant.checkInCode,
      "Phòng Ban": win.participant.email,
      "Giải Thưởng": win.prize.name,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh Sach Trung Thuong");
    XLSX.writeFile(wb, `Danh_Sach_Trúng_Giải_${new Date().toLocaleDateString('vi-VN')}.xlsx`);
    enqueueSnackbar("Đã xuất file Excel thành công", { variant: "success" });
  };

  const handleCancelWinner = async (winnerId) => {
    if (!window.confirm("BẠN CÓ CHẮC CHẮN MUỐN HỦY KẾT QUẢ NÀY? Người này sẽ được quay lại danh sách chưa trúng và số lượng quà sẽ được cộng lại.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/draw/${winnerId}`);
      enqueueSnackbar("Đã hủy kết quả trúng thưởng thành công", { variant: "info" });
      fetchData();
    } catch (err) {
      enqueueSnackbar("Lỗi khi hủy kết quả", { variant: "error" });
    }
  };

  const handleSavePrize = async () => {
    try {
      if (currentPrize.id) {
        await axios.put(`${API_BASE_URL}/admin/prizes/${currentPrize.id}`, currentPrize);
      } else {
        await axios.post(`${API_BASE_URL}/admin/prizes`, currentPrize);
      }
      setOpenPrizeDialog(false);
      fetchData();
      enqueueSnackbar("Lưu giải thưởng thành công", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi lưu giải thưởng", { variant: "error" });
    }
  };

  const handleDeletePrize = async (id) => {
    if (!window.confirm("Xác nhận xóa giải thưởng này?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/prizes/${id}`);
      fetchData();
      enqueueSnackbar("Đã xóa giải thưởng", { variant: "info" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi xóa", { variant: "error" });
    }
  };

  const handleSaveParticipant = async () => {
    try {
      if (currentParticipant.id) {
        await axios.put(`${API_BASE_URL}/admin/participants/${currentParticipant.id}`, currentParticipant);
      } else {
        await axios.post(`${API_BASE_URL}/check-in`, currentParticipant);
      }
      setOpenParticipantDialog(false);
      fetchData();
      enqueueSnackbar("Lưu nhân viên thành công", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi lưu nhân viên", { variant: "error" });
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm("Xác nhận xóa nhân viên này?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/participants/${id}`);
      fetchData();
      enqueueSnackbar("Đã xóa nhân viên", { variant: "info" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi xóa", { variant: "error" });
    }
  };

  const handleSaveHonor = async () => {
    try {
      if (currentHonor.id) {
        await axios.put(`${HONORS_API_URL}/${currentHonor.id}`, currentHonor);
      } else {
        await axios.post(HONORS_API_URL, currentHonor);
      }
      setOpenHonorDialog(false);
      fetchData();
      enqueueSnackbar("Lưu danh hiệu vinh danh thành công", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi lưu danh hiệu", { variant: "error" });
    }
  };

  const handleDeleteHonor = async (id) => {
    if (!window.confirm("Xác nhận xóa danh hiệu này?")) return;
    try {
      await axios.delete(`${HONORS_API_URL}/${id}`);
      fetchData();
      enqueueSnackbar("Đã xóa danh hiệu vinh danh", { variant: "info" });
    } catch (err) {
      enqueueSnackbar("Lỗi khi xóa", { variant: "error" });
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": { fontWeight: 700, fontSize: "1rem" }
            }}
          >
            <Tab icon={<People />} iconPosition="start" label="Nhân Viên" />
            <Tab icon={<EmojiEvents />} iconPosition="start" label="Giải Thưởng" />
            <Tab icon={<CheckCircle />} iconPosition="start" label="Danh Sách Trúng Quà" />
            <Tab icon={<WorkspacePremium />} iconPosition="start" label="Vinh Danh" />
          </Tabs>

          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAlt />}
            onClick={handleResetSystem}
            size="small"
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Reset Hệ Thống
          </Button>
        </Box>

        {/* TAB 1: NHÂN VIÊN */}
        {currentTab === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>Danh Sách Nhân Viên ({participants.length})</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={showOnlyNonWinners} 
                        onChange={(e) => setShowOnlyNonWinners(e.target.checked)} 
                        color="primary"
                      />
                    }
                    label={<Typography variant="body2" fontWeight={600}>Chỉ hiện người chưa trúng</Typography>}
                  />
                  <TextField
                    size="small"
                    placeholder="Tìm tên hoặc mã NV..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                    sx={{ width: 300 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      setCurrentParticipant({ name: "", phone: "", email: "" });
                      setOpenParticipantDialog(true);
                    }}
                    sx={{ borderRadius: 2, bgcolor: "#00796b" }}
                  >
                    Thêm NV
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ borderRadius: 2 }}
                  >
                    Nhập Excel
                    <input type="file" hidden accept=".xlsx, .xls" onChange={handleExcelImport} />
                  </Button>
                </Box>
              </Box>
              
              <TableContainer sx={{ maxHeight: "calc(100vh - 350px)" }}>
                <Table stickyHeader size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Tên Nhân Viên</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Phòng Ban</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Mã NV</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Trạng Thái</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }} align="right">Thao Tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participants
                      .filter((p) => {
                        const name = p.name || "";
                        const code = p.checkInCode || "";
                        const search = searchTerm.toLowerCase();
                        
                        const matchesSearch = name.toLowerCase().includes(search) ||
                          code.toLowerCase().includes(search);
                          
                        const matchesWinnerFilter = showOnlyNonWinners ? !p.isWinner : true;
                        return matchesSearch && matchesWinnerFilter;
                      })
                      .map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={p.imageUrl} sx={{ width: 40, height: 40 }}>{(p.name || "U").charAt(0)}</Avatar>
                            <Typography variant="body1" fontWeight={600}>{p.name || "N/A"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell><code style={{ color: "#00796b", fontWeight: 700, fontSize: "1rem" }}>{p.checkInCode}</code></TableCell>
                        <TableCell>
                          {p.isWinner ? (
                            <Chip label="Đã Trúng" color="success" size="small" sx={{ fontWeight: 700 }} />
                          ) : (
                            <Chip label="Chưa Trúng" variant="outlined" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => { setCurrentParticipant(p); setOpenParticipantDialog(true); }}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteParticipant(p.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        )}

        {/* TAB 2: GIẢI THƯỞNG */}
        {currentTab === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>Quản Lý Giải Thưởng ({prizes.length})</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setCurrentPrize({ name: "", totalQuantity: 0, imageUrl: "" });
                    setOpenPrizeDialog(true);
                  }}
                  sx={{ borderRadius: 2, bgcolor: "#00796b" }}
                >
                  Thêm Giải Thưởng Mới
                </Button>
              </Box>

              <Grid container spacing={3}>
                {prizes.map((prize) => (
                  <Grid item xs={12} md={6} lg={4} key={prize.id}>
                    <Card variant="outlined" sx={{ borderRadius: 4, position: "relative", overflow: "visible" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", gap: 3 }}>
                          <Avatar 
                            src={prize.imageUrl} 
                            variant="rounded" 
                            sx={{ width: 80, height: 80, bgcolor: "#e0f2f1", color: "#00796b", border: "1px solid #e0f2f1" }}
                          >
                            <EmojiEvents sx={{ fontSize: 40 }} />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: "#004d40", mb: 1 }}>
                              {prize.name}
                            </Typography>
                            <Stack spacing={0.5}>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">Tổng số lượng:</Typography>
                                <Typography variant="body2" fontWeight={700}>{prize.totalQuantity}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">Đã phát:</Typography>
                                <Typography variant="body2" fontWeight={700} color="error">{prize.totalQuantity - prize.remainingQuantity}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">Còn lại:</Typography>
                                <Typography variant="body2" fontWeight={700} color="success">{prize.remainingQuantity}</Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Tooltip title="Quay số giải này">
                            <IconButton 
                              onClick={() => handleDraw(prize.id)}
                              disabled={prize.remainingQuantity <= 0}
                              sx={{ bgcolor: prize.remainingQuantity > 0 ? "#fff8e1" : "inherit" }}
                            >
                              <PlayArrow sx={{ color: prize.remainingQuantity > 0 ? "#f59e0b" : "inherit" }} />
                            </IconButton>
                          </Tooltip>
                          <IconButton onClick={() => { setCurrentPrize(prize); setOpenPrizeDialog(true); }}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton onClick={() => handleDeletePrize(prize.id)} color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        )}

        {/* TAB 3: DANH SÁCH TRÚNG QUÀ */}
        {currentTab === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Lịch Sử Trúng Thưởng ({winners.length})</Typography>
                  <Typography variant="body2" color="text.secondary">Danh sách chi tiết nhân viên đã may mắn nhận quà</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FileDownload />}
                  onClick={handleExportWinners}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Xuất Excel
                </Button>
              </Box>
              
              <TableContainer sx={{ maxHeight: "calc(100vh - 350px)" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Nhân Viên</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Phòng Ban</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Mã NV</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Giải Thưởng Nhận Được</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }} align="right">Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {winners.map((win) => (
                      <TableRow key={win.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={win.participant?.imageUrl} sx={{ width: 40, height: 40 }}>
                              {(win.participant?.name || "U").charAt(0)}
                            </Avatar>
                            <Typography variant="body1" fontWeight={600}>
                              {win.participant?.name || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{win.participant?.email || "N/A"}</TableCell>
                        <TableCell><code>{win.participant?.checkInCode || "N/A"}</code></TableCell>
                        <TableCell>
                          <Chip 
                            icon={<EmojiEvents fontSize="small" />}
                            label={win.prize?.name || "N/A"} 
                            sx={{ bgcolor: "#e0f2f1", color: "#00796b", fontWeight: 800, px: 1 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Hủy kết quả trúng thưởng">
                            <IconButton color="error" onClick={() => handleCancelWinner(win.id)}>
                              <HistoryEdu />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {winners.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                          <Box sx={{ opacity: 0.3 }}>
                            <EmojiEvents sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h6">Chưa có ai trúng thưởng</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        )}

        {/* TAB 4: VINH DANH */}
        {currentTab === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>Danh Sách Vinh Danh ({honors.length})</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      setCurrentHonor({ 
                        name: "", 
                        title: "", 
                        category: "nhanVienXuatSac", 
                        description: "", 
                        imageUrl: "", 
                        badge: defaultBadges["nhanVienXuatSac"] 
                      });
                      setOpenHonorDialog(true);
                    }}
                    sx={{ borderRadius: 2, bgcolor: "#00796b" }}
                  >
                    Thêm Vinh Danh
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ borderRadius: 2 }}
                  >
                    Nhập Excel
                    <input type="file" hidden accept=".xlsx, .xls" onChange={handleHonorExcelImport} />
                  </Button>
                </Box>
              </Box>
              
              <TableContainer sx={{ maxHeight: "calc(100vh - 350px)" }}>
                <Table stickyHeader size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Họ và Tên / Tập thể</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Chức vụ / Tiêu đề</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Phân loại</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Huy hiệu</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }} align="right">Thao Tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {honors.map((h) => (
                      <TableRow key={h.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={h.imageUrl} sx={{ width: 40, height: 40 }}>{(h.name || "H").charAt(0)}</Avatar>
                            <Typography variant="body1" fontWeight={600}>{h.name || "N/A"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{h.title}</TableCell>
                        <TableCell>
                          <Chip label={categories[h.category] || h.category} color="primary" variant="outlined" size="small" />
                        </TableCell>
                        <TableCell>{h.badge}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => { setCurrentHonor(h); setOpenHonorDialog(true); }}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteHonor(h.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        )}
      </Box>

      {/* Prize Dialog */}
      <Dialog open={openPrizeDialog} onClose={() => setOpenPrizeDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>{currentPrize.id ? "Sửa Giải Thưởng" : "Thêm Giải Thưởng"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tên Giải Thưởng"
              value={currentPrize.name}
              onChange={(e) => setCurrentPrize({ ...currentPrize, name: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Số Lượng Tổng"
              value={currentPrize.totalQuantity}
              onChange={(e) => setCurrentPrize({ ...currentPrize, totalQuantity: parseInt(e.target.value) || 0 })}
            />
            <TextField
              fullWidth
              label="URL Ảnh"
              value={currentPrize.imageUrl}
              onChange={(e) => setCurrentPrize({ ...currentPrize, imageUrl: e.target.value })}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Tải Ảnh Giải Thưởng
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, "prize")} />
            </Button>
            {currentPrize.imageUrl && (
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Avatar src={currentPrize.imageUrl} variant="rounded" sx={{ width: 80, height: 80, mx: "auto", border: "1px solid #e0f2f1" }} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenPrizeDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSavePrize} startIcon={<Save />} sx={{ bgcolor: "#00796b" }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Participant Dialog */}
      <Dialog open={openParticipantDialog} onClose={() => setOpenParticipantDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>{currentParticipant.id ? "Sửa Nhân Viên" : "Thêm Nhân Viên"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tên NV"
              value={currentParticipant.name}
              onChange={(e) => setCurrentParticipant({ ...currentParticipant, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phòng"
              value={currentParticipant.email}
              onChange={(e) => setCurrentParticipant({ ...currentParticipant, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone"
              value={currentParticipant.phone}
              onChange={(e) => setCurrentParticipant({ ...currentParticipant, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Mã NV"
              value={currentParticipant.checkInCode || ""}
              onChange={(e) => setCurrentParticipant({ ...currentParticipant, checkInCode: e.target.value })}
              placeholder="Để trống để tự động tạo"
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Tải Ảnh Avatar
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, "participant")} />
            </Button>
            {currentParticipant.imageUrl && (
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Avatar src={currentParticipant.imageUrl} sx={{ width: 80, height: 80, mx: "auto", border: "2px solid #00796b" }} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenParticipantDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveParticipant} startIcon={<Save />} sx={{ bgcolor: "#00796b" }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Honor Dialog */}
      <Dialog open={openHonorDialog} onClose={() => setOpenHonorDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{currentHonor.id ? "Sửa Vinh Danh" : "Thêm Vinh Danh"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Họ và Tên / Tên Tập thể"
              value={currentHonor.name}
              onChange={(e) => setCurrentHonor({ ...currentHonor, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Chức vụ / Tiêu đề phụ"
              value={currentHonor.title}
              onChange={(e) => setCurrentHonor({ ...currentHonor, title: e.target.value })}
            />
            <TextField
              select
              fullWidth
              label="Phân loại"
              value={currentHonor.category}
              onChange={(e) => {
                const newCat = e.target.value;
                // Nếu badge đang trống hoặc đang là badge mặc định của category cũ, thì cập nhật theo category mới
                const isDefaultBadge = Object.values(defaultBadges).includes(currentHonor.badge) || !currentHonor.badge;
                
                setCurrentHonor({ 
                  ...currentHonor, 
                  category: newCat,
                  badge: isDefaultBadge ? defaultBadges[newCat] : currentHonor.badge
                });
              }}
              SelectProps={{ native: true }}
            >
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Huy hiệu (Badge text)"
              value={currentHonor.badge}
              onChange={(e) => setCurrentHonor({ ...currentHonor, badge: e.target.value })}
              placeholder="Ví dụ: 🏆 TẬP THỂ XUẤT SẮC"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả thành tích"
              value={currentHonor.description}
              onChange={(e) => setCurrentHonor({ ...currentHonor, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="URL Ảnh"
              value={currentHonor.imageUrl}
              onChange={(e) => setCurrentHonor({ ...currentHonor, imageUrl: e.target.value })}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Tải Ảnh
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, "honor")} />
            </Button>
            {currentHonor.imageUrl && (
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Avatar src={currentHonor.imageUrl} variant="rounded" sx={{ width: 100, height: 100, mx: "auto", border: "2px solid #00796b" }} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenHonorDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveHonor} startIcon={<Save />} sx={{ bgcolor: "#00796b" }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
