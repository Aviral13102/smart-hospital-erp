package com.smarthospital.lab.controller;

import com.smarthospital.lab.entity.LabSample;
import com.smarthospital.lab.entity.SampleMovement;
import com.smarthospital.lab.service.LabSampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab/samples")
@CrossOrigin(origins = "*")
public class LabSampleController {

    private final LabSampleService labSampleService;

    @Autowired
    public LabSampleController(LabSampleService labSampleService) {
        this.labSampleService = labSampleService;
    }

    @GetMapping
    public ResponseEntity<List<LabSample>> getAllSamples() {
        return ResponseEntity.ok(labSampleService.getAllSamples());
    }

    @GetMapping("/active")
    public ResponseEntity<List<LabSample>> getActiveSamples() {
        return ResponseEntity.ok(labSampleService.getActiveSamples());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabSample> getSampleById(@PathVariable Long id) {
        return labSampleService.getSampleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sample-id/{sampleId}")
    public ResponseEntity<LabSample> getSampleBySampleId(@PathVariable String sampleId) {
        return labSampleService.getSampleBySampleId(sampleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<LabSample>> getSamplesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(labSampleService.getSamplesByPatient(patientId));
    }

    @GetMapping("/in-transit")
    public ResponseEntity<List<LabSample>> getSamplesInTransit() {
        return ResponseEntity.ok(labSampleService.getSamplesInTransit());
    }

    @GetMapping("/processing")
    public ResponseEntity<List<LabSample>> getProcessingSamples() {
        return ResponseEntity.ok(labSampleService.getProcessingSamples());
    }

    @GetMapping("/pending-reports")
    public ResponseEntity<List<LabSample>> getPendingReports() {
        return ResponseEntity.ok(labSampleService.getPendingReports());
    }

    @GetMapping("/{id}/movements")
    public ResponseEntity<List<SampleMovement>> getSampleMovements(@PathVariable Long id) {
        return ResponseEntity.ok(labSampleService.getSampleMovements(id));
    }

    @PostMapping
    public ResponseEntity<LabSample> createSample(@RequestBody LabSample sample) {
        LabSample created = labSampleService.createSample(sample);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/collect")
    public ResponseEntity<LabSample> collectSample(
            @PathVariable Long id,
            @RequestParam String collectedById,
            @RequestParam String collectedByName,
            @RequestParam String location) {
        try {
            LabSample updated = labSampleService.collectSample(id, collectedById, collectedByName, location);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<LabSample> moveSample(
            @PathVariable Long id,
            @RequestParam String toLocation,
            @RequestParam String movedById,
            @RequestParam String movedByName) {
        try {
            LabSample updated = labSampleService.moveSample(id, toLocation, movedById, movedByName);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/receive-at-lab")
    public ResponseEntity<LabSample> receiveAtLab(@PathVariable Long id) {
        try {
            LabSample updated = labSampleService.receiveAtLab(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/start-processing")
    public ResponseEntity<LabSample> startProcessing(@PathVariable Long id) {
        try {
            LabSample updated = labSampleService.startProcessing(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<LabSample> completeTest(
            @PathVariable Long id,
            @RequestBody String result) {
        try {
            LabSample updated = labSampleService.completeTest(id, result);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<LabSample> reportResult(@PathVariable Long id) {
        try {
            LabSample updated = labSampleService.reportResult(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<LabSample> rejectSample(
            @PathVariable Long id,
            @RequestBody String notes) {
        try {
            LabSample updated = labSampleService.rejectSample(id, notes);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
