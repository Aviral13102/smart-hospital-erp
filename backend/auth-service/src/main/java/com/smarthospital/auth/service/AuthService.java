package com.smarthospital.auth.service;

import com.smarthospital.auth.entity.User;
import com.smarthospital.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initDefaultAdmin() {
        // Create default admin if not exists
        if (!userRepository.existsByEmail("superadmin@hospital.com")) {
            User admin = new User();
            admin.setEmail("superadmin@hospital.com");
            admin.setPassword(passwordEncoder.encode("Admin@Hospital2026!"));
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setRole(User.UserRole.ADMIN);
            admin.setDepartment("Administration");
            admin.setEmployeeId("ADMIN-001");
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("Default admin created: superadmin@hospital.com");
        }
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getIsActive() && passwordEncoder.matches(password, user.getPassword())) {
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public User registerUser(String email, String password, String firstName, String lastName,
            User.UserRole role, String department) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setDepartment(department);
        user.setEmployeeId(generateEmployeeId(role));
        user.setIsActive(true);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findByIsActiveTrue();
    }

    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }

    public User updateUser(Long id, String firstName, String lastName, String department, User.UserRole role) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setDepartment(department);
                    user.setRole(role);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deactivateUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsActive(false);
            userRepository.save(user);
        });
    }

    public void activateUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsActive(true);
            userRepository.save(user);
        });
    }

    public void changePassword(Long userId, String newPassword) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        });
    }

    private String generateEmployeeId(User.UserRole role) {
        String prefix = switch (role) {
            case ADMIN -> "ADM";
            case DOCTOR -> "DOC";
            case NURSE -> "NUR";
            case LAB_TECH -> "LAB";
            case TRANSPORT -> "TRN";
            case PHARMACIST -> "PHR";
            case RECEPTIONIST -> "REC";
            default -> "STF";
        };
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
