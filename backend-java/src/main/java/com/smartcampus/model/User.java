package com.smartcampus.model;

import java.io.Serializable;

public class User implements Serializable {
    private String id;
    private String studentId;
    private String email;
    private String password;
    private String role;

    public User() {}

    public User(String studentId, String email, String password, String role) {
        this.studentId = studentId;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
