import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import { WorkspacePremium } from "@mui/icons-material";

const HONORS_API_URL = "http://localhost:8080/api/honors";

const HonorsListPage = () => {
  const [honors, setHonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const categories = [
    { key: "all", label: "Tất cả" },
    { key: "tapTheXuatSac", label: "Tập thể xuất sắc" },
    { key: "truongKhoaXuatSac", label: "Trưởng khoa xuất sắc" },
    { key: "nhanVienXuatSac", label: "Nhân viên xuất sắc" },
    { key: "nhanVienCongHien", label: "Nhân viên cống hiến" },
  ];

  useEffect(() => {
    fetchHonors();
  }, []);

  const fetchHonors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(HONORS_API_URL);
      setHonors(res.data);
    } catch (error) {
      console.error("Error fetching honors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHonors = currentTab === 0 
    ? honors 
    : honors.filter(h => h.category === categories[currentTab].key);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8", py: 6 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
            <WorkspacePremium sx={{ fontSize: 40, color: "#D4AF37" }} />
            <Typography variant="h4" fontWeight={800} sx={{ color: "#004d40" }}>
              DANH SÁCH VINH DANH
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: 4, overflow: "hidden", mb: 4 }}>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
                bgcolor: "#fff",
                "& .MuiTab-root": { fontWeight: 700, py: 2 }
              }}
            >
              {categories.map((cat, index) => (
                <Tab key={cat.key} label={cat.label} />
              ))}
            </Tabs>

            <Box sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Họ và Tên / Tập thể</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Chức vụ / Tiêu đề</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Phân loại</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Huy hiệu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredHonors.map((h) => (
                        <TableRow key={h.id} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar src={h.imageUrl} sx={{ width: 45, height: 45 }}>{(h.name || "H").charAt(0)}</Avatar>
                              <Typography variant="body1" fontWeight={600}>{h.name || "N/A"}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{h.title}</TableCell>
                          <TableCell>
                            <Chip 
                              label={categories.find(c => c.key === h.category)?.label || h.category} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#D4AF37", fontWeight: 700 }}>
                              {h.badge}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredHonors.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                            <Typography color="text.secondary">Chưa có dữ liệu trong mục này</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HonorsListPage;

