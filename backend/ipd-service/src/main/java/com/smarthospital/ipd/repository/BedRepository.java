package com.smarthospital.ipd.repository;

import com.smarthospital.ipd.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {

    Optional<Bed> findByBedNumber(String bedNumber);

    List<Bed> findByWard(String ward);

    List<Bed> findByType(Bed.BedType type);

    List<Bed> findByStatus(Bed.BedStatus status);

    List<Bed> findByWardAndStatus(String ward, Bed.BedStatus status);

    List<Bed> findByTypeAndStatus(Bed.BedType type, Bed.BedStatus status);

    @Query("SELECT b FROM Bed b WHERE b.type = :type AND b.status = 'AVAILABLE' ORDER BY b.bedNumber")
    List<Bed> findAvailableBedsByType(Bed.BedType type);

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.ward = :ward AND b.status = 'AVAILABLE'")
    Long countAvailableByWard(String ward);

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.type = :type AND b.status = 'AVAILABLE'")
    Long countAvailableByType(Bed.BedType type);

    @Query("SELECT b.type, b.status, COUNT(b) FROM Bed b GROUP BY b.type, b.status")
    List<Object[]> getBedStatistics();
}
