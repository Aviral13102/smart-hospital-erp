package com.smarthospital.opd.repository;

import com.smarthospital.opd.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatient_Id(Long patientId);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByDepartment(String department);

    List<Appointment> findByStatus(Appointment.AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.scheduledTime BETWEEN :start AND :end ORDER BY a.scheduledTime")
    List<Appointment> findByScheduledTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.scheduledTime BETWEEN :start AND :end ORDER BY a.scheduledTime")
    List<Appointment> findByDoctorIdAndScheduledTimeBetween(String doctorId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.department = :department AND DATE(a.scheduledTime) = CURRENT_DATE ORDER BY a.scheduledTime")
    List<Appointment> findTodaysAppointmentsByDepartment(String department);

    @Query("SELECT COALESCE(MAX(a.tokenNumber), 0) FROM Appointment a WHERE a.department = :department AND DATE(a.scheduledTime) = CURRENT_DATE")
    Integer findMaxTokenNumberForToday(String department);
}
