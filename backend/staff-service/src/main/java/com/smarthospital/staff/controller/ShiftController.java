package com.smarthospital.staff.controller;

import com.smarthospital.staff.entity.Shift;
import com.smarthospital.staff.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff/shifts")
@CrossOrigin(origins = "*")
public class ShiftController {

    private final ShiftService shiftService;

    @Autowired
    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping
    public ResponseEntity<List<Shift>> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {
        return shiftService.getShiftById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<Shift>> getShiftsByStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(shiftService.getShiftsByStaff(staffId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Shift>> getShiftsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(shiftService.getShiftsByDate(date));
    }

    @GetMapping("/ward/{ward}")
    public ResponseEntity<List<Shift>> getShiftsByWard(@PathVariable String ward) {
        return ResponseEntity.ok(shiftService.getShiftsByWard(ward));
    }

    @GetMapping("/ward/{ward}/date/{date}")
    public ResponseEntity<List<Shift>> getShiftsByWardAndDate(
            @PathVariable String ward,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(shiftService.getShiftsByWardAndDate(ward, date));
    }

    @GetMapping("/roster/staff/{staffId}")
    public ResponseEntity<List<Shift>> getStaffRoster(
            @PathVariable Long staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(shiftService.getStaffRoster(staffId, startDate, endDate));
    }

    @GetMapping("/roster/ward/{ward}")
    public ResponseEntity<List<Shift>> getWardRoster(
            @PathVariable String ward,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(shiftService.getWardRoster(ward, startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<Shift> createShift(@RequestBody Shift shift) {
        Shift created = shiftService.createShift(shift);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Shift>> createBulkShifts(@RequestBody List<Shift> shifts) {
        List<Shift> created = shiftService.createBulkShifts(shifts);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<Shift> checkIn(@PathVariable Long id) {
        try {
            Shift updated = shiftService.checkIn(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<Shift> checkOut(@PathVariable Long id) {
        try {
            Shift updated = shiftService.checkOut(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/swap")
    public ResponseEntity<Shift> swapShift(
            @PathVariable Long id,
            @RequestParam Long newStaffId) {
        try {
            Shift updated = shiftService.swapShift(id, newStaffId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Shift> cancelShift(@PathVariable Long id) {
        try {
            Shift updated = shiftService.cancelShift(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        shiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
