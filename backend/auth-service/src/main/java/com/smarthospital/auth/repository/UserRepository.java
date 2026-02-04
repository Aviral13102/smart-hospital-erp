package com.smarthospital.auth.repository;

import com.smarthospital.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(User.UserRole role);

    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE u.isActive = true AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', ?1, '%')))")
    List<User> searchUsers(String query);

    List<User> findByDepartment(String department);
}
