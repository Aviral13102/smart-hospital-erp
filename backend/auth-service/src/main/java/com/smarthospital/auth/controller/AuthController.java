package com.smarthospital.auth.controller;

import com.smarthospital.auth.dto.LoginRequest;
import com.smarthospital.auth.dto.LoginResponse;
import com.smarthospital.auth.dto.UserInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @GetMapping("/public/status")
    public Map<String, String> getStatus() {
        return Map.of("status", "Auth Service is running", "access", "Public");
    }

    /**
     * Mock login endpoint for local development.
     * In production, this would validate against AWS Cognito.
     */
    @PostMapping("/public/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Mock authentication - in production, validate against Cognito
        String role = determineRole(request.getEmail());

        LoginResponse response = LoginResponse.builder()
                .token("mock-jwt-token-" + UUID.randomUUID().toString())
                .email(request.getEmail())
                .name(extractName(request.getEmail()))
                .role(role)
                .expiresIn(3600000) // 1 hour
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/profile")
    public ResponseEntity<UserInfo> getUserProfile(Principal principal) {
        String email = principal != null ? principal.getName() : "demo@hospital.com";

        UserInfo userInfo = UserInfo.builder()
                .id(UUID.randomUUID().toString())
                .email(email)
                .name(extractName(email))
                .role(determineRole(email))
                .department("General")
                .build();

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/public/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private String determineRole(String email) {
        if (email.contains("admin"))
            return "ADMIN";
        if (email.contains("doctor"))
            return "DOCTOR";
        if (email.contains("nurse"))
            return "NURSE";
        if (email.contains("lab"))
            return "LAB_TECH";
        if (email.contains("transport"))
            return "TRANSPORT";
        return "STAFF";
    }

    private String extractName(String email) {
        String localPart = email.split("@")[0];
        return localPart.substring(0, 1).toUpperCase() + localPart.substring(1).replace(".", " ");
    }
}
