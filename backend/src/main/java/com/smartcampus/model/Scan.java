package com.smartcampus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "scans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "location_id", nullable = false)
    private Long locationId;

    @Column(nullable = false)
    private String type; // 'entry' or 'exit'

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public Scan(Long userId, Long locationId, String type) {
        this.userId = userId;
        this.locationId = locationId;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }
}