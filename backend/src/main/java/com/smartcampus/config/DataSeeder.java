package com.smartcampus.config;

import com.smartcampus.model.Location;
import com.smartcampus.model.User;
import com.smartcampus.repository.LocationRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed locations if none exist
        if (locationRepository.count() == 0) {
            Location[] locations = {
                new Location("Library", "LIB_01", 100, "Main Campus Library"),
                new Location("Cafeteria", "CAF_01", 60, "Central Cafeteria"),
                new Location("Study Room", "STD_01", 40, "Quiet Study Area"),
                new Location("Computer Lab", "LAB_01", 30, "CS Department Lab"),
                new Location("Gym", "GYM_01", 50, "Campus Gym")
            };

            for (Location location : locations) {
                locationRepository.save(location);
            }
        }

        // Seed admin user if not exists
        if (userRepository.findByStudentId("0112310000").isEmpty()) {
            User admin = new User("0112310000", "admin@uiu.ac.bd", passwordEncoder.encode("admin123"), "admin");
            userRepository.save(admin);
        }
    }
}