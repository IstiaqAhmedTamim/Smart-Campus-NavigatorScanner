package com.smartcampus.auth;

import com.smartcampus.model.User;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    private final ConcurrentHashMap<String, String> sessionStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, User> users = new ConcurrentHashMap<>();

    public String login(String studentId, String password) {
        User user = users.get(studentId);
        if (user != null && user.getPassword().equals(password)) {
            String token = UUID.randomUUID().toString();
            sessionStore.put(token, studentId);
            return token;
        }
        return null;
    }

    public boolean validateToken(String token) {
        return sessionStore.containsKey(token);
    }

    public void logout(String token) {
        sessionStore.remove(token);
    }

    public void register(User user) {
        users.put(user.getStudentId(), user);
    }
}
