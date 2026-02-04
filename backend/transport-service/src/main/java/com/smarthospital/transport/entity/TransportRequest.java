package com.smarthospital.transport.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transport_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    private String patientName;

    @Column(nullable = false)
    private String fromLocation;

    @Column(nullable = false)
    private String toLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportType transportType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    private String requestedById;

    private String requestedByName;

    private String assignedPorterId;

    private String assignedPorterName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String equipment; // e.g., "Wheelchair", "Stretcher", "Bed"

    private Boolean requiresOxygen;

    private Boolean requiresMonitor;

    private LocalDateTime requestedAt;

    private LocalDateTime assignedAt;

    private LocalDateTime pickedUpAt;

    private LocalDateTime deliveredAt;

    private Integer estimatedMinutes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        requestedAt = LocalDateTime.now();
        if (status == null) {
            status = RequestStatus.PENDING;
        }
        if (priority == null) {
            priority = Priority.NORMAL;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TransportType {
        WHEELCHAIR, STRETCHER, BED, WALKING_ASSIST, AMBULATORY
    }

    public enum RequestStatus {
        PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED
    }

    public enum Priority {
        LOW, NORMAL, HIGH, URGENT, EMERGENCY
    }
}
