package com.smarthospital.lab.service;

import com.smarthospital.lab.entity.LabSample;
import com.smarthospital.lab.entity.SampleMovement;
import com.smarthospital.lab.repository.LabSampleRepository;
import com.smarthospital.lab.repository.SampleMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class LabSampleService {

    private final LabSampleRepository labSampleRepository;
    private final SampleMovementRepository sampleMovementRepository;

    @Autowired
    public LabSampleService(LabSampleRepository labSampleRepository,
            SampleMovementRepository sampleMovementRepository) {
        this.labSampleRepository = labSampleRepository;
        this.sampleMovementRepository = sampleMovementRepository;
    }

    public List<LabSample> getAllSamples() {
        return labSampleRepository.findAll();
    }

    public List<LabSample> getActiveSamples() {
        return labSampleRepository.findActiveSamples();
    }

    public Optional<LabSample> getSampleById(Long id) {
        return labSampleRepository.findById(id);
    }

    public Optional<LabSample> getSampleBySampleId(String sampleId) {
        return labSampleRepository.findBySampleId(sampleId);
    }

    public List<LabSample> getSamplesByPatient(Long patientId) {
        return labSampleRepository.findByPatientId(patientId);
    }

    public List<LabSample> getSamplesInTransit() {
        return labSampleRepository.findSamplesInTransit();
    }

    public List<LabSample> getProcessingSamples() {
        return labSampleRepository.findProcessingSamples();
    }

    public List<LabSample> getPendingReports() {
        return labSampleRepository.findPendingReports();
    }

    public LabSample createSample(LabSample sample) {
        sample.setSampleId(generateSampleId(sample.getSampleType()));
        sample.setStatus(LabSample.SampleStatus.ORDERED);
        sample.setOrderedAt(LocalDateTime.now());
        return labSampleRepository.save(sample);
    }

    public LabSample collectSample(Long id, String collectedById, String collectedByName, String location) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    sample.setStatus(LabSample.SampleStatus.COLLECTED);
                    sample.setCollectedById(collectedById);
                    sample.setCollectedByName(collectedByName);
                    sample.setCollectedAt(LocalDateTime.now());
                    sample.setCurrentLocation(location);
                    LabSample savedSample = labSampleRepository.save(sample);

                    // Log movement
                    logMovement(savedSample, "Collection Point", location, collectedById, collectedByName,
                            SampleMovement.MovementType.COLLECTION);

                    return savedSample;
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public LabSample moveSample(Long id, String toLocation, String movedById, String movedByName) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    String fromLocation = sample.getCurrentLocation();
                    sample.setCurrentLocation(toLocation);
                    sample.setStatus(LabSample.SampleStatus.IN_TRANSIT);
                    LabSample savedSample = labSampleRepository.save(sample);

                    logMovement(savedSample, fromLocation, toLocation, movedById, movedByName,
                            SampleMovement.MovementType.TRANSIT);

                    return savedSample;
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public LabSample receiveAtLab(Long id) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    String fromLocation = sample.getCurrentLocation();
                    sample.setStatus(LabSample.SampleStatus.RECEIVED_AT_LAB);
                    sample.setReceivedAtLabAt(LocalDateTime.now());
                    sample.setCurrentLocation("Laboratory");
                    LabSample savedSample = labSampleRepository.save(sample);

                    logMovement(savedSample, fromLocation, "Laboratory", null, "Lab Technician",
                            SampleMovement.MovementType.LAB_RECEIPT);

                    return savedSample;
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public LabSample startProcessing(Long id) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    sample.setStatus(LabSample.SampleStatus.PROCESSING);
                    sample.setProcessingStartedAt(LocalDateTime.now());
                    return labSampleRepository.save(sample);
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public LabSample completeTest(Long id, String result) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    sample.setStatus(LabSample.SampleStatus.COMPLETED);
                    sample.setCompletedAt(LocalDateTime.now());
                    sample.setResult(result);
                    return labSampleRepository.save(sample);
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public LabSample reportResult(Long id) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    sample.setStatus(LabSample.SampleStatus.REPORTED);
                    sample.setReportedAt(LocalDateTime.now());
                    return labSampleRepository.save(sample);
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public LabSample rejectSample(Long id, String notes) {
        return labSampleRepository.findById(id)
                .map(sample -> {
                    sample.setStatus(LabSample.SampleStatus.REJECTED);
                    sample.setNotes(notes);
                    return labSampleRepository.save(sample);
                })
                .orElseThrow(() -> new RuntimeException("Sample not found"));
    }

    public List<SampleMovement> getSampleMovements(Long sampleId) {
        return sampleMovementRepository.findBySampleIdOrderByTimestampDesc(sampleId);
    }

    private void logMovement(LabSample sample, String from, String to, String movedById,
            String movedByName, SampleMovement.MovementType type) {
        SampleMovement movement = SampleMovement.builder()
                .sample(sample)
                .fromLocation(from)
                .toLocation(to)
                .movedById(movedById)
                .movedByName(movedByName)
                .movementType(type)
                .timestamp(LocalDateTime.now())
                .build();
        sampleMovementRepository.save(movement);
    }

    private String generateSampleId(LabSample.SampleType type) {
        String prefix = switch (type) {
            case BLOOD -> "BLD";
            case URINE -> "URN";
            case STOOL -> "STL";
            case SPUTUM -> "SPT";
            case SWAB -> "SWB";
            case TISSUE -> "TSS";
            case CSF -> "CSF";
            case FLUID -> "FLD";
            default -> "SAM";
        };
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
