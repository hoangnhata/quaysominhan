package com.luckydraw.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "draw_history")
public class DrawHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "prize_id")
    private Prize prize;

    @Column(name = "draw_time", insertable = false, updatable = false)
    private LocalDateTime drawTime;
}

