package com.smartcampus.service;

import com.smartcampus.model.Location;
import com.smartcampus.model.Scan;
import com.smartcampus.repository.ScanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScanService {
    private final ScanRepository scanRepository;

    @Transactional
    public Scan createScan(Long userId, Long locationId, String type) {
        Scan scan = new Scan(userId, locationId, type);
        return scanRepository.save(scan);
    }
}