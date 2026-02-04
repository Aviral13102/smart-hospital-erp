package com.smarthospital.opd.service;

import com.smarthospital.opd.entity.Appointment;
import com.smarthospital.opd.entity.Patient;
import com.smarthospital.opd.entity.QueueEntry;
import com.smarthospital.opd.repository.AppointmentRepository;
import com.smarthospital.opd.repository.PatientRepository;
import com.smarthospital.opd.repository.QueueEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final QueueEntryRepository queueEntryRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getTodaysAppointments(String department) {
        return appointmentRepository.findTodaysAppointmentsByDepartment(department);
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByScheduledTimeBetween(start, end);
    }

    public Appointment createAppointment(Appointment appointment) {
        // Generate token number for the day
        Integer maxToken = appointmentRepository.findMaxTokenNumberForToday(appointment.getDepartment());
        appointment.setTokenNumber(maxToken + 1);
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        return appointmentRepository.save(appointment);
    }

    public Appointment checkIn(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .map(appointment -> {
                    appointment.setStatus(Appointment.AppointmentStatus.CHECKED_IN);
                    appointment.setCheckInTime(LocalDateTime.now());
                    Appointment savedAppointment = appointmentRepository.save(appointment);

                    // Add to queue
                    addToQueue(savedAppointment);

                    return savedAppointment;
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    private void addToQueue(Appointment appointment) {
        Integer maxQueue = queueEntryRepository.findMaxQueueNumberForToday(appointment.getDepartment());

        QueueEntry queueEntry = QueueEntry.builder()
                .appointment(appointment)
                .department(appointment.getDepartment())
                .doctorId(appointment.getDoctorId())
                .queueNumber(maxQueue + 1)
                .status(QueueEntry.QueueStatus.WAITING)
                .priority(QueueEntry.Priority.NORMAL)
                .build();

        queueEntryRepository.save(queueEntry);

        appointment.setStatus(Appointment.AppointmentStatus.IN_QUEUE);
        appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment completeAppointment(Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
                    appointment.setConsultationEndTime(LocalDateTime.now());
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
}
