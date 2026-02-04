package com.smarthospital.opd.repository;

import com.smarthospital.opd.entity.QueueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {

    List<QueueEntry> findByDepartmentAndStatusOrderByPriorityDescQueueNumberAsc(
            String department, QueueEntry.QueueStatus status);

    List<QueueEntry> findByDoctorIdAndStatusOrderByPriorityDescQueueNumberAsc(
            String doctorId, QueueEntry.QueueStatus status);

    Optional<QueueEntry> findByAppointmentId(Long appointmentId);

    @Query("SELECT COALESCE(MAX(q.queueNumber), 0) FROM QueueEntry q WHERE q.department = :department AND DATE(q.enteredQueueAt) = CURRENT_DATE")
    Integer findMaxQueueNumberForToday(String department);

    @Query("SELECT q FROM QueueEntry q WHERE q.department = :department AND q.status IN ('WAITING', 'CALLED') ORDER BY q.priority DESC, q.queueNumber ASC")
    List<QueueEntry> findActiveQueueByDepartment(String department);

    @Query("SELECT COUNT(q) FROM QueueEntry q WHERE q.department = :department AND q.status = 'WAITING'")
    Long countWaitingByDepartment(String department);
}
