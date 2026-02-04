package com.smarthospital.auth.controller;

import com.smarthospital.auth.dto.LoginRequest;
import com.smarthospital.auth.dto.LoginResponse;
import com.smarthospital.auth.dto.SignupRequest;
import com.smarthospital.auth.dto.UserInfo;
import com.smarthospital.auth.entity.User;
import com.smarthospital.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/public/status")
    public ResponseEntity<Map<String, String>> getStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Auth Service is running");
        response.put("access", "Public");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        return authService.authenticate(request.getEmail(), request.getPassword())
                .map(user -> {
                    LoginResponse response = LoginResponse.builder()
                            .token("jwt-" + UUID.randomUUID().toString())
                            .email(user.getEmail())
                            .name(user.getFullName())
                            .role(user.getRole().name())
                            .expiresIn(3600000)
                            .build();
                    return ResponseEntity.ok((Object) response);
                })
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Invalid email or password");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
                });
    }

    @PostMapping("/public/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupRequest request) {
        try {
            // Validate required fields
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is required");
                return ResponseEntity.badRequest().body(error);
            }
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(error);
            }
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "First name is required");
                return ResponseEntity.badRequest().body(error);
            }
            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Last name is required");
                return ResponseEntity.badRequest().body(error);
            }

            User.UserRole role = User.UserRole.STAFF;
            if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
                try {
                    role = User.UserRole.valueOf(request.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Default to STAFF if invalid role
                }
            }

            User user = authService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName(),
                    role,
                    request.getDepartment() != null ? request.getDepartment() : "General");

            Map<String, String> response = new HashMap<>();
            response.put("message", "Account created successfully");
            response.put("email", user.getEmail());
            response.put("employeeId", user.getEmployeeId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/public/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    // Admin endpoints for user management
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserInfo>> getAllUsers() {
        List<UserInfo> users = authService.getAllUsers().stream()
                .map(this::mapToUserInfo)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/users/role/{role}")
    public ResponseEntity<List<UserInfo>> getUsersByRole(@PathVariable String role) {
        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            List<UserInfo> users = authService.getUsersByRole(userRole).stream()
                    .map(this::mapToUserInfo)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/users/{id}")
    public ResponseEntity<UserInfo> getUserById(@PathVariable Long id) {
        return authService.getUserById(id)
                .map(this::mapToUserInfo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/users/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateUser(@PathVariable Long id) {
        authService.deactivateUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deactivated");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/users/{id}/activate")
    public ResponseEntity<Map<String, String>> activateUser(@PathVariable Long id) {
        authService.activateUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User activated");
        return ResponseEntity.ok(response);
    }

    private UserInfo mapToUserInfo(User user) {
        return UserInfo.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .name(user.getFullName())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .build();
    }
}
