package com.smarthospital.staff.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(nullable = false)
    private LocalDate shiftDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftType shiftType;

    private LocalTime startTime;

    private LocalTime endTime;

    @Column(nullable = false)
    private String ward;

    private String department;

    @Enumerated(EnumType.STRING)
    private ShiftStatus status;

    private LocalTime actualCheckIn;

    private LocalTime actualCheckOut;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String assignedById;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Default constructor
    public Shift() {}

    // All-args constructor
    public Shift(Long id, Staff staff, LocalDate shiftDate, ShiftType shiftType, LocalTime startTime,
                 LocalTime endTime, String ward, String department, ShiftStatus status,
                 LocalTime actualCheckIn, LocalTime actualCheckOut, String notes, String assignedById,
                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.staff = staff;
        this.shiftDate = shiftDate;
        this.shiftType = shiftType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.ward = ward;
        this.department = department;
        this.status = status;
        this.actualCheckIn = actualCheckIn;
        this.actualCheckOut = actualCheckOut;
        this.notes = notes;
        this.assignedById = assignedById;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ShiftStatus.SCHEDULED;
        }
        setDefaultTimes();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private void setDefaultTimes() {
        if (startTime == null && shiftType != null) {
            switch (shiftType) {
                case MORNING -> {
                    startTime = LocalTime.of(6, 0);
                    endTime = LocalTime.of(14, 0);
                }
                case AFTERNOON -> {
                    startTime = LocalTime.of(14, 0);
                    endTime = LocalTime.of(22, 0);
                }
                case NIGHT -> {
                    startTime = LocalTime.of(22, 0);
                    endTime = LocalTime.of(6, 0);
                }
                case GENERAL -> {
                    startTime = LocalTime.of(9, 0);
                    endTime = LocalTime.of(17, 0);
                }
            }
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }

    public LocalDate getShiftDate() { return shiftDate; }
    public void setShiftDate(LocalDate shiftDate) { this.shiftDate = shiftDate; }

    public ShiftType getShiftType() { return shiftType; }
    public void setShiftType(ShiftType shiftType) { this.shiftType = shiftType; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public ShiftStatus getStatus() { return status; }
    public void setStatus(ShiftStatus status) { this.status = status; }

    public LocalTime getActualCheckIn() { return actualCheckIn; }
    public void setActualCheckIn(LocalTime actualCheckIn) { this.actualCheckIn = actualCheckIn; }

    public LocalTime getActualCheckOut() { return actualCheckOut; }
    public void setActualCheckOut(LocalTime actualCheckOut) { this.actualCheckOut = actualCheckOut; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getAssignedById() { return assignedById; }
    public void setAssignedById(String assignedById) { this.assignedById = assignedById; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder pattern
    public static ShiftBuilder builder() { return new ShiftBuilder(); }

    public static class ShiftBuilder {
        private Long id;
        private Staff staff;
        private LocalDate shiftDate;
        private ShiftType shiftType;
        private LocalTime startTime;
        private LocalTime endTime;
        private String ward;
        private String department;
        private ShiftStatus status;
        private LocalTime actualCheckIn;
        private LocalTime actualCheckOut;
        private String notes;
        private String assignedById;

        public ShiftBuilder id(Long id) { this.id = id; return this; }
        public ShiftBuilder staff(Staff staff) { this.staff = staff; return this; }
        public ShiftBuilder shiftDate(LocalDate shiftDate) { this.shiftDate = shiftDate; return this; }
        public ShiftBuilder shiftType(ShiftType shiftType) { this.shiftType = shiftType; return this; }
        public ShiftBuilder startTime(LocalTime startTime) { this.startTime = startTime; return this; }
        public ShiftBuilder endTime(LocalTime endTime) { this.endTime = endTime; return this; }
        public ShiftBuilder ward(String ward) { this.ward = ward; return this; }
        public ShiftBuilder department(String department) { this.department = department; return this; }
        public ShiftBuilder status(ShiftStatus status) { this.status = status; return this; }
        public ShiftBuilder actualCheckIn(LocalTime actualCheckIn) { this.actualCheckIn = actualCheckIn; return this; }
        public ShiftBuilder actualCheckOut(LocalTime actualCheckOut) { this.actualCheckOut = actualCheckOut; return this; }
        public ShiftBuilder notes(String notes) { this.notes = notes; return this; }
        public ShiftBuilder assignedById(String assignedById) { this.assignedById = assignedById; return this; }

        public Shift build() {
            Shift shift = new Shift();
            shift.id = this.id;
            shift.staff = this.staff;
            shift.shiftDate = this.shiftDate;
            shift.shiftType = this.shiftType;
            shift.startTime = this.startTime;
            shift.endTime = this.endTime;
            shift.ward = this.ward;
            shift.department = this.department;
            shift.status = this.status;
            shift.actualCheckIn = this.actualCheckIn;
            shift.actualCheckOut = this.actualCheckOut;
            shift.notes = this.notes;
            shift.assignedById = this.assignedById;
            return shift;
        }
    }

    public enum ShiftType {
        MORNING, AFTERNOON, NIGHT, GENERAL
    }

    public enum ShiftStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, ABSENT, SWAPPED, CANCELLED
    }
}
