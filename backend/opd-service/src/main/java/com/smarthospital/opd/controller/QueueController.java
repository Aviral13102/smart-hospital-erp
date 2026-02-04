package com.smarthospital.opd.controller;

import com.smarthospital.opd.entity.QueueEntry;
import com.smarthospital.opd.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opd/queue")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QueueController {

    private final QueueService queueService;

    @GetMapping("/department/{department}")
    public ResponseEntity<List<QueueEntry>> getQueueByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(queueService.getQueueByDepartment(department));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<QueueEntry>> getQueueByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(queueService.getQueueByDoctor(doctorId));
    }

    @GetMapping("/department/{department}/count")
    public ResponseEntity<Map<String, Long>> getWaitingCount(@PathVariable String department) {
        Long count = queueService.getWaitingCount(department);
        return ResponseEntity.ok(Map.of("waitingCount", count));
    }

    @PostMapping("/doctor/{doctorId}/call-next")
    public ResponseEntity<QueueEntry> callNextPatient(@PathVariable String doctorId) {
        try {
            QueueEntry entry = queueService.callNext(doctorId);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/start-consultation")
    public ResponseEntity<QueueEntry> startConsultation(@PathVariable Long id) {
        try {
            QueueEntry entry = queueService.startConsultation(id);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<QueueEntry> completeConsultation(@PathVariable Long id) {
        try {
            QueueEntry entry = queueService.completeConsultation(id);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/skip")
    public ResponseEntity<QueueEntry> skipPatient(@PathVariable Long id) {
        try {
            QueueEntry entry = queueService.skipPatient(id);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<QueueEntry> updatePriority(
            @PathVariable Long id,
            @RequestParam QueueEntry.Priority priority) {
        try {
            QueueEntry entry = queueService.updatePriority(id, priority);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
