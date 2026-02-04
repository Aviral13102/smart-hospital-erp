package com.smarthospital.lab.repository;

import com.smarthospital.lab.entity.LabSample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabSampleRepository extends JpaRepository<LabSample, Long> {

    Optional<LabSample> findBySampleId(String sampleId);

    List<LabSample> findByPatientId(Long patientId);

    List<LabSample> findByStatus(LabSample.SampleStatus status);

    List<LabSample> findByDepartment(String department);

    List<LabSample> findBySampleType(LabSample.SampleType sampleType);

    @Query("SELECT s FROM LabSample s WHERE s.status IN ('ORDERED', 'COLLECTED', 'IN_TRANSIT', 'RECEIVED_AT_LAB', 'PROCESSING') ORDER BY s.priority DESC, s.orderedAt ASC")
    List<LabSample> findActiveSamples();

    @Query("SELECT s FROM LabSample s WHERE s.status = 'COLLECTED' OR s.status = 'IN_TRANSIT' ORDER BY s.priority DESC")
    List<LabSample> findSamplesInTransit();

    @Query("SELECT s FROM LabSample s WHERE s.status = 'PROCESSING' ORDER BY s.priority DESC, s.receivedAtLabAt ASC")
    List<LabSample> findProcessingSamples();

    @Query("SELECT s FROM LabSample s WHERE s.status = 'COMPLETED' AND s.reportedAt IS NULL ORDER BY s.completedAt ASC")
    List<LabSample> findPendingReports();

    @Query("SELECT COUNT(s) FROM LabSample s WHERE s.status = :status")
    Long countByStatus(LabSample.SampleStatus status);
}
