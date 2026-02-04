package com.smarthospital.staff.repository;

import com.smarthospital.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmployeeId(String employeeId);

    List<Staff> findByRole(Staff.StaffRole role);

    List<Staff> findByDepartment(String department);

    List<Staff> findByWard(String ward);

    List<Staff> findByStatus(Staff.EmploymentStatus status);

    List<Staff> findByRoleAndStatus(Staff.StaffRole role, Staff.EmploymentStatus status);

    @Query("SELECT s FROM Staff s WHERE s.role = :role AND s.status = 'ACTIVE' ORDER BY s.lastName")
    List<Staff> findActiveByRole(Staff.StaffRole role);

    @Query("SELECT s FROM Staff s WHERE s.department = :department AND s.status = 'ACTIVE' ORDER BY s.lastName")
    List<Staff> findActiveByDepartment(String department);

    @Query("SELECT s FROM Staff s WHERE LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR s.employeeId LIKE CONCAT('%', :search, '%')")
    List<Staff> searchStaff(String search);
}
