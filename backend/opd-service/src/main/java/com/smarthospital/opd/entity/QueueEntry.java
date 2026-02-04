package com.smarthospital.opd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "queue_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    public enum QueueStatus {
        WAITING, CALLED, IN_CONSULTATION, COMPLETED, SKIPPED
    }

    public enum Priority {
        LOW, NORMAL, HIGH, URGENT
    }
}
