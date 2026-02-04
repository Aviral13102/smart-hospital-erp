package com.smarthospital.lab.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sample_movements")
public class SampleMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sample_id", nullable = false)
    private LabSample sample;

    @Column(nullable = false)
    private String fromLocation;

    @Column(nullable = false)
    private String toLocation;

    private String movedById;

    private String movedByName;

    @Enumerated(EnumType.STRING)
    private MovementType movementType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime timestamp;

    // Default constructor
    public SampleMovement() {}

    // All-args constructor
    public SampleMovement(Long id, LabSample sample, String fromLocation, String toLocation,
                          String movedById, String movedByName, MovementType movementType,
                          String notes, LocalDateTime timestamp) {
        this.id = id;
        this.sample = sample;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.movedById = movedById;
        this.movedByName = movedByName;
        this.movementType = movementType;
        this.notes = notes;
        this.timestamp = timestamp;
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LabSample getSample() { return sample; }
    public void setSample(LabSample sample) { this.sample = sample; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public String getMovedById() { return movedById; }
    public void setMovedById(String movedById) { this.movedById = movedById; }

    public String getMovedByName() { return movedByName; }
    public void setMovedByName(String movedByName) { this.movedByName = movedByName; }

    public MovementType getMovementType() { return movementType; }
    public void setMovementType(MovementType movementType) { this.movementType = movementType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Builder pattern
    public static SampleMovementBuilder builder() { return new SampleMovementBuilder(); }

    public static class SampleMovementBuilder {
        private Long id;
        private LabSample sample;
        private String fromLocation;
        private String toLocation;
        private String movedById;
        private String movedByName;
        private MovementType movementType;
        private String notes;
        private LocalDateTime timestamp;

        public SampleMovementBuilder id(Long id) { this.id = id; return this; }
        public SampleMovementBuilder sample(LabSample sample) { this.sample = sample; return this; }
        public SampleMovementBuilder fromLocation(String fromLocation) { this.fromLocation = fromLocation; return this; }
        public SampleMovementBuilder toLocation(String toLocation) { this.toLocation = toLocation; return this; }
        public SampleMovementBuilder movedById(String movedById) { this.movedById = movedById; return this; }
        public SampleMovementBuilder movedByName(String movedByName) { this.movedByName = movedByName; return this; }
        public SampleMovementBuilder movementType(MovementType movementType) { this.movementType = movementType; return this; }
        public SampleMovementBuilder notes(String notes) { this.notes = notes; return this; }
        public SampleMovementBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public SampleMovement build() {
            SampleMovement movement = new SampleMovement();
            movement.id = this.id;
            movement.sample = this.sample;
            movement.fromLocation = this.fromLocation;
            movement.toLocation = this.toLocation;
            movement.movedById = this.movedById;
            movement.movedByName = this.movedByName;
            movement.movementType = this.movementType;
            movement.notes = this.notes;
            movement.timestamp = this.timestamp;
            return movement;
        }
    }

    public enum MovementType {
        COLLECTION, HANDOVER, TRANSIT, LAB_RECEIPT, INTERNAL_TRANSFER, ARCHIVAL
    }
}
