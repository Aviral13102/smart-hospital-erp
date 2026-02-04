package com.smarthospital.transport.controller;

import com.smarthospital.transport.entity.TransportRequest;
import com.smarthospital.transport.service.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transport/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransportController {

    private final TransportService transportService;

    @GetMapping
    public ResponseEntity<List<TransportRequest>> getAllRequests() {
        return ResponseEntity.ok(transportService.getAllRequests());
    }

    @GetMapping("/active")
    public ResponseEntity<List<TransportRequest>> getActiveRequests() {
        return ResponseEntity.ok(transportService.getActiveRequests());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TransportRequest>> getPendingRequests() {
        return ResponseEntity.ok(transportService.getPendingRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportRequest> getRequestById(@PathVariable Long id) {
        return transportService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/porter/{porterId}")
    public ResponseEntity<List<TransportRequest>> getRequestsByPorter(@PathVariable String porterId) {
        return ResponseEntity.ok(transportService.getRequestsByPorter(porterId));
    }

    @GetMapping("/pending/count")
    public ResponseEntity<Map<String, Long>> getPendingCount() {
        return ResponseEntity.ok(Map.of("count", transportService.getPendingCount()));
    }

    @PostMapping
    public ResponseEntity<TransportRequest> createRequest(@RequestBody TransportRequest request) {
        TransportRequest created = transportService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<TransportRequest> assignPorter(
            @PathVariable Long id,
            @RequestParam String porterId,
            @RequestParam String porterName) {
        try {
            TransportRequest updated = transportService.assignPorter(id, porterId, porterName);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<TransportRequest> startTransport(@PathVariable Long id) {
        try {
            TransportRequest updated = transportService.startTransport(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<TransportRequest> completeTransport(@PathVariable Long id) {
        try {
            TransportRequest updated = transportService.completeTransport(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<TransportRequest> cancelRequest(@PathVariable Long id) {
        try {
            TransportRequest updated = transportService.cancelRequest(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TransportRequest> updatePriority(
            @PathVariable Long id,
            @RequestParam TransportRequest.Priority priority) {
        try {
            TransportRequest updated = transportService.updatePriority(id, priority);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
