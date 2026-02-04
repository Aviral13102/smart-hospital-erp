package com.smarthospital.ipd.service;

import com.smarthospital.ipd.entity.Admission;
import com.smarthospital.ipd.entity.Bed;
import com.smarthospital.ipd.repository.AdmissionRepository;
import com.smarthospital.ipd.repository.BedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final BedRepository bedRepository;

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public List<Admission> getActiveAdmissions() {
        return admissionRepository.findAllActiveAdmissions();
    }

    public Optional<Admission> getAdmissionById(Long id) {
        return admissionRepository.findById(id);
    }

    public List<Admission> getAdmissionsByPatient(Long patientId) {
        return admissionRepository.findByPatientId(patientId);
    }

    public List<Admission> getAdmissionsByWard(String ward) {
        return admissionRepository.findActiveAdmissionsByWard(ward);
    }

    public Long getActiveAdmissionCount() {
        return admissionRepository.countActiveAdmissions();
    }

    public Admission admitPatient(Admission admission) {
        // Check if bed is available
        Bed bed = bedRepository.findById(admission.getBed().getId())
                .orElseThrow(() -> new RuntimeException("Bed not found"));

        if (bed.getStatus() != Bed.BedStatus.AVAILABLE) {
            throw new RuntimeException("Bed is not available");
        }

        // Check if patient already has an active admission
        Optional<Admission> existingAdmission = admissionRepository
                .findActiveAdmissionByPatientId(admission.getPatientId());
        if (existingAdmission.isPresent()) {
            throw new RuntimeException("Patient already has an active admission");
        }

        // Update bed status
        bed.setStatus(Bed.BedStatus.OCCUPIED);
        bedRepository.save(bed);

        // Create admission
        admission.setStatus(Admission.AdmissionStatus.ADMITTED);
        admission.setAdmissionTime(LocalDateTime.now());
        return admissionRepository.save(admission);
    }

    public Admission transferPatient(Long admissionId, Long newBedId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        Bed newBed = bedRepository.findById(newBedId)
                .orElseThrow(() -> new RuntimeException("New bed not found"));

        if (newBed.getStatus() != Bed.BedStatus.AVAILABLE) {
            throw new RuntimeException("New bed is not available");
        }

        // Free old bed
        Bed oldBed = admission.getBed();
        oldBed.setStatus(Bed.BedStatus.CLEANING);
        bedRepository.save(oldBed);

        // Assign new bed
        newBed.setStatus(Bed.BedStatus.OCCUPIED);
        bedRepository.save(newBed);

        admission.setBed(newBed);
        return admissionRepository.save(admission);
    }

    public Admission dischargePatient(Long admissionId, String dischargeNotes, String dischargeType) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        // Free bed
        Bed bed = admission.getBed();
        bed.setStatus(Bed.BedStatus.CLEANING);
        bedRepository.save(bed);

        // Update admission
        admission.setStatus(Admission.AdmissionStatus.DISCHARGED);
        admission.setActualDischargeTime(LocalDateTime.now());
        admission.setDischargeNotes(dischargeNotes);
        admission.setDischargeType(dischargeType);

        return admissionRepository.save(admission);
    }

    public Admission updateAdmission(Long id, Admission admissionDetails) {
        return admissionRepository.findById(id)
                .map(admission -> {
                    admission.setPrimaryDiagnosis(admissionDetails.getPrimaryDiagnosis());
                    admission.setAdmissionNotes(admissionDetails.getAdmissionNotes());
                    admission.setExpectedDischargeDate(admissionDetails.getExpectedDischargeDate());
                    return admissionRepository.save(admission);
                })
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }
}
