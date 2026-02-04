package com.smarthospital.lab.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_samples")
public class LabSample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sampleId;

    @Column(nullable = false)
    private Long patientId;

    private String patientName;

    private String medicalRecordNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SampleType sampleType;

    @Column(nullable = false)
    private String testName;

    private String testCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SampleStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private String collectedById;

    private String collectedByName;

    private String currentLocation;

    private String orderedByDoctorId;

    private String orderedByDoctorName;

    private String department;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String result;

    private LocalDateTime orderedAt;

    private LocalDateTime collectedAt;

    private LocalDateTime receivedAtLabAt;

    private LocalDateTime processingStartedAt;

    private LocalDateTime completedAt;

    private LocalDateTime reportedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Default constructor
    public LabSample() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = SampleStatus.ORDERED;
        }
        if (priority == null) {
            priority = Priority.NORMAL;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSampleId() { return sampleId; }
    public void setSampleId(String sampleId) { this.sampleId = sampleId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getMedicalRecordNumber() { return medicalRecordNumber; }
    public void setMedicalRecordNumber(String medicalRecordNumber) { this.medicalRecordNumber = medicalRecordNumber; }

    public SampleType getSampleType() { return sampleType; }
    public void setSampleType(SampleType sampleType) { this.sampleType = sampleType; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }

    public SampleStatus getStatus() { return status; }
    public void setStatus(SampleStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getCollectedById() { return collectedById; }
    public void setCollectedById(String collectedById) { this.collectedById = collectedById; }

    public String getCollectedByName() { return collectedByName; }
    public void setCollectedByName(String collectedByName) { this.collectedByName = collectedByName; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public String getOrderedByDoctorId() { return orderedByDoctorId; }
    public void setOrderedByDoctorId(String orderedByDoctorId) { this.orderedByDoctorId = orderedByDoctorId; }

    public String getOrderedByDoctorName() { return orderedByDoctorName; }
    public void setOrderedByDoctorName(String orderedByDoctorName) { this.orderedByDoctorName = orderedByDoctorName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public LocalDateTime getOrderedAt() { return orderedAt; }
    public void setOrderedAt(LocalDateTime orderedAt) { this.orderedAt = orderedAt; }

    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }

    public LocalDateTime getReceivedAtLabAt() { return receivedAtLabAt; }
    public void setReceivedAtLabAt(LocalDateTime receivedAtLabAt) { this.receivedAtLabAt = receivedAtLabAt; }

    public LocalDateTime getProcessingStartedAt() { return processingStartedAt; }
    public void setProcessingStartedAt(LocalDateTime processingStartedAt) { this.processingStartedAt = processingStartedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum SampleType {
        BLOOD, URINE, STOOL, SPUTUM, SWAB, TISSUE, CSF, FLUID, OTHER
    }

    public enum SampleStatus {
        ORDERED, COLLECTED, IN_TRANSIT, RECEIVED_AT_LAB, PROCESSING, COMPLETED, REPORTED, REJECTED
    }

    public enum Priority {
        ROUTINE, NORMAL, URGENT, STAT
    }
}
