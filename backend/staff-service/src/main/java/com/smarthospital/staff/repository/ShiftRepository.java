package com.smarthospital.staff.repository;

import com.smarthospital.staff.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

    List<Shift> findByStaffId(Long staffId);

    List<Shift> findByShiftDate(LocalDate date);

    List<Shift> findByWard(String ward);

    List<Shift> findByShiftDateAndWard(LocalDate date, String ward);

    List<Shift> findByShiftDateAndShiftType(LocalDate date, Shift.ShiftType shiftType);

    @Query("SELECT s FROM Shift s WHERE s.staff.id = :staffId AND s.shiftDate BETWEEN :startDate AND :endDate ORDER BY s.shiftDate")
    List<Shift> findByStaffIdAndDateRange(Long staffId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT s FROM Shift s WHERE s.ward = :ward AND s.shiftDate BETWEEN :startDate AND :endDate ORDER BY s.shiftDate, s.shiftType")
    List<Shift> findByWardAndDateRange(String ward, LocalDate startDate, LocalDate endDate);

    @Query("SELECT s FROM Shift s WHERE s.shiftDate = :date AND s.status = 'SCHEDULED' ORDER BY s.ward, s.shiftType")
    List<Shift> findScheduledShiftsForDate(LocalDate date);

    @Query("SELECT COUNT(s) FROM Shift s WHERE s.ward = :ward AND s.shiftDate = :date AND s.shiftType = :shiftType")
    Long countByWardAndDateAndType(String ward, LocalDate date, Shift.ShiftType shiftType);
}
