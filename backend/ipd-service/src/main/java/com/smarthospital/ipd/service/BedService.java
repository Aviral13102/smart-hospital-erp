package com.smarthospital.ipd.service;

import com.smarthospital.ipd.entity.Bed;
import com.smarthospital.ipd.repository.BedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BedService {

    private final BedRepository bedRepository;

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public Optional<Bed> getBedById(Long id) {
        return bedRepository.findById(id);
    }

    public Optional<Bed> getBedByNumber(String bedNumber) {
        return bedRepository.findByBedNumber(bedNumber);
    }

    public List<Bed> getBedsByWard(String ward) {
        return bedRepository.findByWard(ward);
    }

    public List<Bed> getBedsByType(Bed.BedType type) {
        return bedRepository.findByType(type);
    }

    public List<Bed> getAvailableBeds(Bed.BedType type) {
        return bedRepository.findAvailableBedsByType(type);
    }

    public Long getAvailableCountByWard(String ward) {
        return bedRepository.countAvailableByWard(ward);
    }

    public Long getAvailableCountByType(Bed.BedType type) {
        return bedRepository.countAvailableByType(type);
    }

    public Map<String, Map<String, Long>> getBedStatistics() {
        List<Object[]> stats = bedRepository.getBedStatistics();
        return stats.stream().collect(Collectors.groupingBy(
                row -> ((Bed.BedType) row[0]).name(),
                Collectors.toMap(
                        row -> ((Bed.BedStatus) row[1]).name(),
                        row -> (Long) row[2])));
    }

    public Bed createBed(Bed bed) {
        return bedRepository.save(bed);
    }

    public Bed updateBed(Long id, Bed bedDetails) {
        return bedRepository.findById(id)
                .map(bed -> {
                    bed.setBedNumber(bedDetails.getBedNumber());
                    bed.setWard(bedDetails.getWard());
                    bed.setFloor(bedDetails.getFloor());
                    bed.setType(bedDetails.getType());
                    bed.setFeatures(bedDetails.getFeatures());
                    bed.setDailyRate(bedDetails.getDailyRate());
                    return bedRepository.save(bed);
                })
                .orElseThrow(() -> new RuntimeException("Bed not found"));
    }

    public Bed updateStatus(Long id, Bed.BedStatus status) {
        return bedRepository.findById(id)
                .map(bed -> {
                    bed.setStatus(status);
                    if (status == Bed.BedStatus.CLEANING) {
                        bed.setLastCleanedAt(LocalDateTime.now());
                    }
                    return bedRepository.save(bed);
                })
                .orElseThrow(() -> new RuntimeException("Bed not found"));
    }

    public void deleteBed(Long id) {
        bedRepository.deleteById(id);
    }
}
