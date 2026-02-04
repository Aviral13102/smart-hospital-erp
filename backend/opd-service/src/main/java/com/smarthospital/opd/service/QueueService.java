package com.smarthospital.opd.service;

import com.smarthospital.opd.entity.QueueEntry;
import com.smarthospital.opd.repository.QueueEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class QueueService {

    private final QueueEntryRepository queueEntryRepository;

    @Autowired
    public QueueService(QueueEntryRepository queueEntryRepository) {
        this.queueEntryRepository = queueEntryRepository;
    }

    public List<QueueEntry> getQueueByDepartment(String department) {
        return queueEntryRepository.findActiveQueueByDepartment(department);
    }

    public List<QueueEntry> getQueueByDoctor(String doctorId) {
        return queueEntryRepository.findByDoctorIdAndStatusOrderByPriorityDescQueueNumberAsc(
                doctorId, QueueEntry.QueueStatus.WAITING);
    }

    public Long getWaitingCount(String department) {
        return queueEntryRepository.countWaitingByDepartment(department);
    }

    public QueueEntry callNext(String doctorId) {
        List<QueueEntry> waitingQueue = queueEntryRepository
                .findByDoctorIdAndStatusOrderByPriorityDescQueueNumberAsc(doctorId, QueueEntry.QueueStatus.WAITING);

        if (waitingQueue.isEmpty()) {
            throw new RuntimeException("No patients waiting in queue");
        }

        QueueEntry next = waitingQueue.get(0);
        next.setStatus(QueueEntry.QueueStatus.CALLED);
        next.setCalledAt(LocalDateTime.now());
        return queueEntryRepository.save(next);
    }

    public QueueEntry startConsultation(Long queueEntryId) {
        return queueEntryRepository.findById(queueEntryId)
                .map(entry -> {
                    entry.setStatus(QueueEntry.QueueStatus.IN_CONSULTATION);
                    return queueEntryRepository.save(entry);
                })
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));
    }

    public QueueEntry completeConsultation(Long queueEntryId) {
        return queueEntryRepository.findById(queueEntryId)
                .map(entry -> {
                    entry.setStatus(QueueEntry.QueueStatus.COMPLETED);
                    entry.setCompletedAt(LocalDateTime.now());
                    return queueEntryRepository.save(entry);
                })
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));
    }

    public QueueEntry skipPatient(Long queueEntryId) {
        return queueEntryRepository.findById(queueEntryId)
                .map(entry -> {
                    entry.setStatus(QueueEntry.QueueStatus.SKIPPED);
                    return queueEntryRepository.save(entry);
                })
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));
    }

    public QueueEntry updatePriority(Long queueEntryId, QueueEntry.Priority priority) {
        return queueEntryRepository.findById(queueEntryId)
                .map(entry -> {
                    entry.setPriority(priority);
                    return queueEntryRepository.save(entry);
                })
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));
    }
}
