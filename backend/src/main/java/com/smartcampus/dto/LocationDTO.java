package com.smartcampus.dto;

import com.smartcampus.model.Location;
import lombok.Data;

@Data
public class LocationDTO {
    private Long id;
    private String name;
    private String qrCode;
    private Integer capacity;
    private Integer currentCount;
    private String description;
    private String status;
    private Double percentage;

    public LocationDTO(Location location) {
        this.id = location.getId();
        this.name = location.getName();
        this.qrCode = location.getQrCode();
        this.capacity = location.getCapacity();
        this.currentCount = location.getCurrentCount();
        this.description = location.getDescription();
        this.status = location.getStatus().toLowerCase();
        this.percentage = location.getPercentage();
    }
}