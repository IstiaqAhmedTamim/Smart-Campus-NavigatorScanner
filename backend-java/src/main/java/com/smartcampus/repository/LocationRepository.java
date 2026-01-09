package com.smartcampus.repository;

import com.smartcampus.model.Location;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.ArrayList;

@Repository
public class LocationRepository {
    private final ConcurrentHashMap<String, Location> database = new ConcurrentHashMap<>();

    public void save(Location location) {
        database.put(location.getQrCode(), location);
    }

    public Optional<Location> findByQrCode(String qrCode) {
        return Optional.ofNullable(database.get(qrCode));
    }

    public List<Location> findAll() {
        return new ArrayList<>(database.values());
    }

    public void delete(String qrCode) {
        database.remove(qrCode);
    }
}
