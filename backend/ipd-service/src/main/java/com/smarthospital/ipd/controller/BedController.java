package com.smarthospital.ipd.controller;

import com.smarthospital.ipd.entity.Bed;
import com.smarthospital.ipd.service.BedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ipd/beds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BedController {

    private final BedService bedService;

    @GetMapping
    public ResponseEntity<List<Bed>> getAllBeds() {
        return ResponseEntity.ok(bedService.getAllBeds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bed> getBedById(@PathVariable Long id) {
        return bedService.getBedById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{bedNumber}")
    public ResponseEntity<Bed> getBedByNumber(@PathVariable String bedNumber) {
        return bedService.getBedByNumber(bedNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ward/{ward}")
    public ResponseEntity<List<Bed>> getBedsByWard(@PathVariable String ward) {
        return ResponseEntity.ok(bedService.getBedsByWard(ward));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Bed>> getBedsByType(@PathVariable Bed.BedType type) {
        return ResponseEntity.ok(bedService.getBedsByType(type));
    }

    @GetMapping("/available/{type}")
    public ResponseEntity<List<Bed>> getAvailableBeds(@PathVariable Bed.BedType type) {
        return ResponseEntity.ok(bedService.getAvailableBeds(type));
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Map<String, Long>>> getBedStatistics() {
        return ResponseEntity.ok(bedService.getBedStatistics());
    }

    @PostMapping
    public ResponseEntity<Bed> createBed(@RequestBody Bed bed) {
        Bed created = bedService.createBed(bed);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bed> updateBed(@PathVariable Long id, @RequestBody Bed bed) {
        try {
            Bed updated = bedService.updateBed(id, bed);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Bed> updateBedStatus(
            @PathVariable Long id,
            @RequestParam Bed.BedStatus status) {
        try {
            Bed updated = bedService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBed(@PathVariable Long id) {
        bedService.deleteBed(id);
        return ResponseEntity.noContent().build();
    }
}
