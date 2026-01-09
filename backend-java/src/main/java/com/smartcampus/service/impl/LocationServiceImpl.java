package com.smartcampus.service.impl;

import com.smartcampus.service.LocationService;
import com.smartcampus.model.Location;
import com.smartcampus.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LocationServiceImpl extends LocationService {
    
    @Autowired
    private LocationRepository repository;

    @Override
    public void updateCrowdCount(String locationId, int change) {
        repository.findByQrCode(locationId).ifPresent(loc -> {
            int current = loc.getCurrentCount();
            loc.setCurrentCount(Math.max(0, current + change));
            repository.save(loc);
        });
    }

    public List<Location> getAllLocations() {
        return repository.findAll();
    }
}
