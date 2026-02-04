package com.smarthospital.staff.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StaffRole role;

    @Column(nullable = false)
    private String department;

    private String ward;

    private String specialization;

    private String phone;

    private String email;

    @Enumerated(EnumType.STRING)
    private EmploymentStatus status;

    private LocalDate joiningDate;

    private String qualifications;

    private String licenseNumber;

    private LocalDate licenseExpiry;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Default constructor
    public Staff() {}

    // All-args constructor
    public Staff(Long id, String employeeId, String firstName, String lastName, StaffRole role,
                 String department, String ward, String specialization, String phone, String email,
                 EmploymentStatus status, LocalDate joiningDate, String qualifications,
                 String licenseNumber, LocalDate licenseExpiry, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.department = department;
        this.ward = ward;
        this.specialization = specialization;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.joiningDate = joiningDate;
        this.qualifications = qualifications;
        this.licenseNumber = licenseNumber;
        this.licenseExpiry = licenseExpiry;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = EmploymentStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public StaffRole getRole() { return role; }
    public void setRole(StaffRole role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public EmploymentStatus getStatus() { return status; }
    public void setStatus(EmploymentStatus status) { this.status = status; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public LocalDate getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(LocalDate licenseExpiry) { this.licenseExpiry = licenseExpiry; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder pattern
    public static StaffBuilder builder() { return new StaffBuilder(); }

    public static class StaffBuilder {
        private Long id;
        private String employeeId;
        private String firstName;
        private String lastName;
        private StaffRole role;
        private String department;
        private String ward;
        private String specialization;
        private String phone;
        private String email;
        private EmploymentStatus status;
        private LocalDate joiningDate;
        private String qualifications;
        private String licenseNumber;
        private LocalDate licenseExpiry;

        public StaffBuilder id(Long id) { this.id = id; return this; }
        public StaffBuilder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public StaffBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public StaffBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public StaffBuilder role(StaffRole role) { this.role = role; return this; }
        public StaffBuilder department(String department) { this.department = department; return this; }
        public StaffBuilder ward(String ward) { this.ward = ward; return this; }
        public StaffBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public StaffBuilder phone(String phone) { this.phone = phone; return this; }
        public StaffBuilder email(String email) { this.email = email; return this; }
        public StaffBuilder status(EmploymentStatus status) { this.status = status; return this; }
        public StaffBuilder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public StaffBuilder qualifications(String qualifications) { this.qualifications = qualifications; return this; }
        public StaffBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public StaffBuilder licenseExpiry(LocalDate licenseExpiry) { this.licenseExpiry = licenseExpiry; return this; }

        public Staff build() {
            Staff staff = new Staff();
            staff.id = this.id;
            staff.employeeId = this.employeeId;
            staff.firstName = this.firstName;
            staff.lastName = this.lastName;
            staff.role = this.role;
            staff.department = this.department;
            staff.ward = this.ward;
            staff.specialization = this.specialization;
            staff.phone = this.phone;
            staff.email = this.email;
            staff.status = this.status;
            staff.joiningDate = this.joiningDate;
            staff.qualifications = this.qualifications;
            staff.licenseNumber = this.licenseNumber;
            staff.licenseExpiry = this.licenseExpiry;
            return staff;
        }
    }

    public enum StaffRole {
        DOCTOR, NURSE, PORTER, LAB_TECHNICIAN, PHARMACIST, RECEPTIONIST, 
        ADMIN, HOUSEKEEPING, MAINTENANCE, SECURITY
    }

    public enum EmploymentStatus {
        ACTIVE, ON_LEAVE, SUSPENDED, RESIGNED, TERMINATED
    }
}
