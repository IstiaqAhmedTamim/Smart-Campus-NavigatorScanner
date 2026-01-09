package com.smartcampus.analytics;

import com.smartcampus.model.Location;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CrowdAnalyticsEngine {
    private final Map<String, List<Integer>> hourlyHistory = new ConcurrentHashMap<>();

    @Scheduled(fixedRate = 3600000) // Every hour
    public void recordSnapshots(List<Location> locations) {
        for (Location loc : locations) {
            hourlyHistory.computeIfAbsent(loc.getId(), k -> new java.util.ArrayList<>())
                         .add(loc.getCurrentCount());
        }
    }

    public Map<String, Double> calculatePeakHours(String locationId) {
        List<Integer> history = hourlyHistory.get(locationId);
        if (history == null || history.isEmpty()) return Map.of();
        
        // Complex analytics logic for peak detection
        double average = history.stream().mapToInt(Integer::intValue).average().orElse(0.0);
        return Map.of("averageDensity", average);
    }
}
