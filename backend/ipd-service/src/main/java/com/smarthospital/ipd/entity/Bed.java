package com.smarthospital.ipd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "beds")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bedNumber;

    @Column(nullable = false)
    private String ward;

    private String floor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedStatus status;

    private String features; // e.g., "Ventilator, Monitor, Oxygen"

    private Double dailyRate;

    private LocalDateTime lastCleanedAt;

    private LocalDateTime lastMaintenanceAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = BedStatus.AVAILABLE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum BedType {
        GENERAL, SEMI_PRIVATE, PRIVATE, ICU, HDU, NICU, PICU, CCU, ISOLATION
    }

    public enum BedStatus {
        AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, CLEANING
    }
}
