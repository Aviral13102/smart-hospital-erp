package com.smarthospital.opd.service;

import com.smarthospital.opd.entity.Patient;
import com.smarthospital.opd.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByMrn(String mrn) {
        return patientRepository.findByMedicalRecordNumber(mrn);
    }

    public List<Patient> searchPatients(String searchTerm) {
        return patientRepository.searchPatients(searchTerm);
    }

    public Patient createPatient(Patient patient) {
        if (patient.getMedicalRecordNumber() == null || patient.getMedicalRecordNumber().isEmpty()) {
            patient.setMedicalRecordNumber(generateMRN());
        }
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setFirstName(patientDetails.getFirstName());
                    patient.setLastName(patientDetails.getLastName());
                    patient.setDateOfBirth(patientDetails.getDateOfBirth());
                    patient.setGender(patientDetails.getGender());
                    patient.setPhone(patientDetails.getPhone());
                    patient.setEmail(patientDetails.getEmail());
                    patient.setAddress(patientDetails.getAddress());
                    patient.setEmergencyContact(patientDetails.getEmergencyContact());
                    patient.setEmergencyPhone(patientDetails.getEmergencyPhone());
                    patient.setBloodGroup(patientDetails.getBloodGroup());
                    patient.setAllergies(patientDetails.getAllergies());
                    patient.setMedicalHistory(patientDetails.getMedicalHistory());
                    return patientRepository.save(patient);
                })
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    private String generateMRN() {
        return "MRN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
