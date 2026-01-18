package com.luckydraw.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "honors")
public class Honor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title; // Chức vụ hoặc Tiêu đề phụ
    private String category; // tapTheXuatSac, truongKhoaXuatSac, nhanVienXuatSac, nhanVienCongHien
    @Column(length = 1000)
    private String description;
    private String imageUrl;
    private String badge;
}

