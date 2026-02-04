package com.smarthospital.opd.repository;

import com.smarthospital.opd.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByMedicalRecordNumber(String medicalRecordNumber);

    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR p.medicalRecordNumber LIKE CONCAT('%', :search, '%') " +
            "OR p.phone LIKE CONCAT('%', :search, '%')")
    List<Patient> searchPatients(String search);

    boolean existsByMedicalRecordNumber(String medicalRecordNumber);
}
