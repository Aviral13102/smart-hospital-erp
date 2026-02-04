package com.smarthospital.ipd.controller;

import com.smarthospital.ipd.entity.Admission;
import com.smarthospital.ipd.service.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ipd/admissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdmissionController {

    private final AdmissionService admissionService;

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Admission>> getActiveAdmissions() {
        return ResponseEntity.ok(admissionService.getActiveAdmissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admission> getAdmissionById(@PathVariable Long id) {
        return admissionService.getAdmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Admission>> getAdmissionsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(admissionService.getAdmissionsByPatient(patientId));
    }

    @GetMapping("/ward/{ward}")
    public ResponseEntity<List<Admission>> getAdmissionsByWard(@PathVariable String ward) {
        return ResponseEntity.ok(admissionService.getAdmissionsByWard(ward));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getActiveAdmissionCount() {
        return ResponseEntity.ok(Map.of("count", admissionService.getActiveAdmissionCount()));
    }

    @PostMapping
    public ResponseEntity<Admission> admitPatient(@RequestBody Admission admission) {
        try {
            Admission created = admissionService.admitPatient(admission);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/transfer")
    public ResponseEntity<Admission> transferPatient(
            @PathVariable Long id,
            @RequestParam Long newBedId) {
        try {
            Admission updated = admissionService.transferPatient(id, newBedId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/discharge")
    public ResponseEntity<Admission> dischargePatient(
            @PathVariable Long id,
            @RequestParam(required = false) String dischargeNotes,
            @RequestParam(defaultValue = "Normal") String dischargeType) {
        try {
            Admission updated = admissionService.dischargePatient(id, dischargeNotes, dischargeType);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admission> updateAdmission(
            @PathVariable Long id,
            @RequestBody Admission admission) {
        try {
            Admission updated = admissionService.updateAdmission(id, admission);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
