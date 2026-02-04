package com.smarthospital.lab.repository;

import com.smarthospital.lab.entity.SampleMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SampleMovementRepository extends JpaRepository<SampleMovement, Long> {

    List<SampleMovement> findBySampleIdOrderByTimestampDesc(Long sampleId);

    @Query("SELECT m FROM SampleMovement m WHERE m.sample.sampleId = :sampleId ORDER BY m.timestamp DESC")
    List<SampleMovement> findBySampleSampleIdOrderByTimestampDesc(String sampleId);

    List<SampleMovement> findByMovedById(String movedById);

    @Query("SELECT m FROM SampleMovement m WHERE m.sample.id = :sampleId ORDER BY m.timestamp DESC LIMIT 1")
    SampleMovement findLatestMovementBySampleId(Long sampleId);
}
