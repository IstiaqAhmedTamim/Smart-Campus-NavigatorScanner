package com.smartcampus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "qr_code", unique = true, nullable = false)
    private String qrCode;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "current_count", nullable = false)
    private Integer currentCount = 0;

    private String description;

    public Location(String name, String qrCode, Integer capacity, String description) {
        this.name = name;
        this.qrCode = qrCode;
        this.capacity = capacity;
        this.description = description;
        this.currentCount = 0;
    }

    public String getStatus() {
        if (capacity == 0) return "LOW";
        double percentage = (double) currentCount / capacity * 100;
        if (percentage < 50) return "LOW";
        if (percentage < 80) return "MEDIUM";
        return "HIGH";
    }

    public double getPercentage() {
        if (capacity == 0) return 0.0;
        return Math.round((double) currentCount / capacity * 100);
    }
}
