package com.smartcampus.service;

import com.smartcampus.model.Location;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Demonstrates Java Collections Framework (ConcurrentHashMap) and thread safety.
 */
public class LocationService {
    // Thread-safe map for location data
    private final Map<String, Location> locationStore = new ConcurrentHashMap<>();

    public void updateCrowdCount(String locationId, int change) {
        // Atomic update in a multi-threaded environment
        locationStore.computeIfPresent(locationId, (id, loc) -> {
            // Logic to update count
            return loc;
        });
    }

    public List<Location> getRecommendedLocations() {
        // Sorting using Streams and Java Collections
        return locationStore.values().stream()
            .sorted((a, b) -> Double.compare(
                (double)a.getCurrentCount()/a.getCapacity(), 
                (double)b.getCurrentCount()/b.getCapacity()))
            .collect(Collectors.toList());
    }
}
