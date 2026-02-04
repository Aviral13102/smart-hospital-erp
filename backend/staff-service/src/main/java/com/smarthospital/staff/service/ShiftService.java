package com.smarthospital.staff.service;

import com.smarthospital.staff.entity.Shift;
import com.smarthospital.staff.entity.Staff;
import com.smarthospital.staff.repository.ShiftRepository;
import com.smarthospital.staff.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public ShiftService(ShiftRepository shiftRepository, StaffRepository staffRepository) {
        this.shiftRepository = shiftRepository;
        this.staffRepository = staffRepository;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    public Optional<Shift> getShiftById(Long id) {
        return shiftRepository.findById(id);
    }

    public List<Shift> getShiftsByStaff(Long staffId) {
        return shiftRepository.findByStaffId(staffId);
    }

    public List<Shift> getShiftsByDate(LocalDate date) {
        return shiftRepository.findByShiftDate(date);
    }

    public List<Shift> getShiftsByWard(String ward) {
        return shiftRepository.findByWard(ward);
    }

    public List<Shift> getShiftsByWardAndDate(String ward, LocalDate date) {
        return shiftRepository.findByShiftDateAndWard(date, ward);
    }

    public List<Shift> getStaffRoster(Long staffId, LocalDate startDate, LocalDate endDate) {
        return shiftRepository.findByStaffIdAndDateRange(staffId, startDate, endDate);
    }

    public List<Shift> getWardRoster(String ward, LocalDate startDate, LocalDate endDate) {
        return shiftRepository.findByWardAndDateRange(ward, startDate, endDate);
    }

    public Shift createShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    public List<Shift> createBulkShifts(List<Shift> shifts) {
        return shiftRepository.saveAll(shifts);
    }

    public Shift checkIn(Long shiftId) {
        return shiftRepository.findById(shiftId)
                .map(shift -> {
                    shift.setActualCheckIn(LocalTime.now());
                    shift.setStatus(Shift.ShiftStatus.IN_PROGRESS);
                    return shiftRepository.save(shift);
                })
                .orElseThrow(() -> new RuntimeException("Shift not found"));
    }

    public Shift checkOut(Long shiftId) {
        return shiftRepository.findById(shiftId)
                .map(shift -> {
                    shift.setActualCheckOut(LocalTime.now());
                    shift.setStatus(Shift.ShiftStatus.COMPLETED);
                    return shiftRepository.save(shift);
                })
                .orElseThrow(() -> new RuntimeException("Shift not found"));
    }

    public Shift swapShift(Long shiftId, Long newStaffId) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        Staff newStaff = staffRepository.findById(newStaffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        shift.setStaff(newStaff);
        shift.setStatus(Shift.ShiftStatus.SWAPPED);
        return shiftRepository.save(shift);
    }

    public Shift cancelShift(Long shiftId) {
        return shiftRepository.findById(shiftId)
                .map(shift -> {
                    shift.setStatus(Shift.ShiftStatus.CANCELLED);
                    return shiftRepository.save(shift);
                })
                .orElseThrow(() -> new RuntimeException("Shift not found"));
    }

    public void deleteShift(Long id) {
        shiftRepository.deleteById(id);
    }
}
