package com.smartcampus.model.events;

import java.time.LocalDateTime;

public class CrowdEvent {
    private String id;
    private String locationId;
    private int oldCount;
    private int newCount;
    private LocalDateTime timestamp;

    public CrowdEvent(String locationId, int oldCount, int newCount) {
        this.locationId = locationId;
        this.oldCount = oldCount;
        this.newCount = newCount;
        this.timestamp = LocalDateTime.now();
    }

    // Getters
    public String getLocationId() { return locationId; }
    public int getOldCount() { return oldCount; }
    public int getNewCount() { return newCount; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
