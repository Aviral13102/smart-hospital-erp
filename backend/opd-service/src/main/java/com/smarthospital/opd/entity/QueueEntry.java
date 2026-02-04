package com.smarthospital.opd.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_entries")
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private Integer queueNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private Integer estimatedWaitMinutes;

    private LocalDateTime enteredQueueAt;

    private LocalDateTime calledAt;

    private LocalDateTime completedAt;

    public QueueEntry() {
    }

    @PrePersist
    protected void onCreate() {
        enteredQueueAt = LocalDateTime.now();
        if (status == null) {
            status = QueueStatus.WAITING;
        }
        if (priority == null) {
            priority = Priority.NORMAL;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getQueueNumber() {
        return queueNumber;
    }

    public void setQueueNumber(Integer queueNumber) {
        this.queueNumber = queueNumber;
    }

    public QueueStatus getStatus() {
        return status;
    }

    public void setStatus(QueueStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Integer getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) {
        this.estimatedWaitMinutes = estimatedWaitMinutes;
    }

    public LocalDateTime getEnteredQueueAt() {
        return enteredQueueAt;
    }

    public void setEnteredQueueAt(LocalDateTime enteredQueueAt) {
        this.enteredQueueAt = enteredQueueAt;
    }

    public LocalDateTime getCalledAt() {
        return calledAt;
    }

    public void setCalledAt(LocalDateTime calledAt) {
        this.calledAt = calledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public enum QueueStatus {
        WAITING, CALLED, IN_CONSULTATION, COMPLETED, SKIPPED
    }

    public enum Priority {
        LOW, NORMAL, HIGH, URGENT
    }
}
