package com.smartcampus.service;

import com.smartcampus.dto.LocationDTO;
import com.smartcampus.model.Location;
import com.smartcampus.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;

    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(LocationDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<LocationDTO> getLocationById(Long id) {
        return locationRepository.findById(id)
                .map(LocationDTO::new);
    }

    public Optional<Location> getLocationByQrCode(String qrCode) {
        return locationRepository.findByQrCode(qrCode);
    }

    @Transactional
    public Location updateLocationCount(Long id, int increment) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        int newCount = location.getCurrentCount() + increment;
        if (newCount < 0) newCount = 0;

        location.setCurrentCount(newCount);
        return locationRepository.save(location);
    }

    public Optional<LocationDTO> getBestLocation() {
        return locationRepository.findAll().stream()
                .min((a, b) -> Double.compare(
                    a.getCapacity() > 0 ? (double) a.getCurrentCount() / a.getCapacity() : 0,
                    b.getCapacity() > 0 ? (double) b.getCurrentCount() / b.getCapacity() : 0))
                .map(LocationDTO::new);
    }
}
