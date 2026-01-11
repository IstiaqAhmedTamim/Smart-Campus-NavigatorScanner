package com.smartcampus.service;

import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId);
    }

    public User createUser(String studentId, String email, String rawPassword, String role) {
        if (userRepository.findByStudentId(studentId).isPresent()) {
            throw new RuntimeException("Student ID already registered");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        User user = new User(studentId, email, encodedPassword, role);
        return userRepository.save(user);
    }

    public boolean validatePassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}