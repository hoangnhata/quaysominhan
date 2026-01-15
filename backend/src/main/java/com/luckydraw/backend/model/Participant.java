package com.luckydraw.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "participants")
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email; // Used for Department
    private String checkInCode;
    private String imageUrl;
    private Boolean isWinner = false;

    @Column(name = "checked_in_at", insertable = false, updatable = false)
    private LocalDateTime checkedInAt;
}
