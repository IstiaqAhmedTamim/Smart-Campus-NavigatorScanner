package com.smartcampus.model.enums;

public enum CrowdStatus {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL;

    public static CrowdStatus fromPercentage(double percentage) {
        if (percentage < 30) return LOW;
        if (percentage < 60) return MEDIUM;
        if (percentage < 90) return HIGH;
        return CRITICAL;
    }
}
