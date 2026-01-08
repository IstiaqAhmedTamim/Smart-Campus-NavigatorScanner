package com.smartcampus.model;

import java.util.HashSet;

public class Location {
    private String id;
    private String name;
    private String qrCode;
    private int capacity;
    private int currentCount;
    private String description;

    // Constructors, Getters and Setters for Reference
    public Location(String id, String name, String qrCode, int capacity) {
        this.id = id;
        this.name = name;
        this.qrCode = qrCode;
        this.capacity = capacity;
        this.currentCount = 0;
    }

    public String getStatus() {
        double percentage = (double) currentCount / capacity * 100;
        if (percentage < 50) return "LOW";
        if (percentage < 80) return "MEDIUM";
        return "HIGH";
    }

    // Standard POJO methods
}
