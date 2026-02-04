package com.smarthospital.ipd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    private String patientName;

    private String medicalRecordNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bed_id", nullable = false)
    private Bed bed;

    @Column(nullable = false)
    private String admittingDoctorId;

    private String admittingDoctorName;

    private String primaryDiagnosis;

    @Column(columnDefinition = "TEXT")
    private String admissionNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdmissionStatus status;

    @Enumerated(EnumType.STRING)
    private AdmissionType type;

    private LocalDateTime admissionTime;

    private LocalDateTime expectedDischargeDate;

    private LocalDateTime actualDischargeTime;

    @Column(columnDefinition = "TEXT")
    private String dischargeNotes;

    private String dischargeType; // e.g., "Normal", "Against Medical Advice", "Transfer"

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (admissionTime == null) {
            admissionTime = LocalDateTime.now();
        }
        if (status == null) {
            status = AdmissionStatus.ADMITTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AdmissionStatus {
        ADMITTED, IN_TREATMENT, READY_FOR_DISCHARGE, DISCHARGED, TRANSFERRED
    }

    public enum AdmissionType {
        EMERGENCY, ELECTIVE, TRANSFER_IN, DAY_CARE
    }
}
