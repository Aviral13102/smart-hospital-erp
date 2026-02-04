package com.smarthospital.ipd.repository;

import com.smarthospital.ipd.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    List<Admission> findByPatientId(Long patientId);

    List<Admission> findByStatus(Admission.AdmissionStatus status);

    Optional<Admission> findByBedIdAndStatus(Long bedId, Admission.AdmissionStatus status);

    @Query("SELECT a FROM Admission a WHERE a.bed.id = :bedId AND a.status = 'ADMITTED'")
    Optional<Admission> findActiveAdmissionByBedId(Long bedId);

    @Query("SELECT a FROM Admission a WHERE a.patientId = :patientId AND a.status = 'ADMITTED'")
    Optional<Admission> findActiveAdmissionByPatientId(Long patientId);

    @Query("SELECT a FROM Admission a WHERE a.status IN ('ADMITTED', 'IN_TREATMENT') ORDER BY a.admissionTime DESC")
    List<Admission> findAllActiveAdmissions();

    @Query("SELECT a FROM Admission a WHERE a.bed.ward = :ward AND a.status IN ('ADMITTED', 'IN_TREATMENT')")
    List<Admission> findActiveAdmissionsByWard(String ward);

    @Query("SELECT COUNT(a) FROM Admission a WHERE a.status = 'ADMITTED'")
    Long countActiveAdmissions();
}
