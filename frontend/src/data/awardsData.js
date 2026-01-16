export const awardsData = {
  tapTheXuatSac: {
    id: 1,
    name: "KHOA NGOẠI",
    title: "TẬP THỂ XUẤT SẮC CỦA NĂM",
    description:
      "Đơn vị dẫn đầu trong công tác chuyên môn và đổi mới sáng tạo năm 2025.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
    badge: "🏆 TẬP THỂ XUẤT SẮC",
  },
  truongKhoaXuatSac: [
    {
      id: 1,
      name: "BS.CKII. Nguyễn Văn A",
      position: "Trưởng khoa Ngoại Tổng quát",
      image: "https://i.pravatar.cc/300?u=1",
      badge: "TRƯỞNG KHOA XUẤT SẮC",
    },
    {
      id: 2,
      name: "ThS.BS. Trần Thị B",
      position: "Trưởng khoa Nhi",
      image: "https://i.pravatar.cc/300?u=2",
      badge: "TRƯỞNG KHOA XUẤT SẮC",
    },
    {
      id: 3,
      name: "BS.CKI. Lê Văn C",
      position: "Trưởng khoa Phụ sản",
      image: "https://i.pravatar.cc/300?u=3",
      badge: "TRƯỞNG KHOA XUẤT SẮC",
    },
    {
      id: 4,
      name: "BS. Phạm Minh D",
      position: "Trưởng phòng Kế hoạch Tổng hợp",
      image: "https://i.pravatar.cc/300?u=4",
      badge: "TRƯỞNG KHOA XUẤT SẮC",
    },
    {
      id: 5,
      name: "ThS. Đỗ Hoàng E",
      position: "Trưởng khoa Cấp cứu",
      image: "https://i.pravatar.cc/300?u=5",
      badge: "TRƯỞNG KHOA XUẤT SẮC",
    },
  ],
  nhanVienXuatSac: Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    name: `Nhân viên ${i + 1}`,
    department:
      i % 3 === 0 ? "Khoa Nội" : i % 3 === 1 ? "Khoa Ngoại" : "Khoa Dược",
    image: `https://i.pravatar.cc/300?u=nvxs${i}`,
    badge: "⭐ NHÂN VIÊN XUẤT SẮC",
    description:
      "Có thành tích vượt trội trong công tác chăm sóc bệnh nhân và hoàn thành xuất sắc các chỉ tiêu được giao.",
  })),
  nhanVienCongHien: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Cán bộ ${i + 1}`,
    department: i % 2 === 0 ? "Hành chính" : "Kỹ thuật",
    image: `https://i.pravatar.cc/300?u=nvch${i}`,
    badge: "🤍 NHÂN VIÊN CỐNG HIẾN",
    description:
      "Gắn bó và đóng góp thầm lặng cho sự phát triển bền vững của Bệnh viện Minh An.",
  })),
};
