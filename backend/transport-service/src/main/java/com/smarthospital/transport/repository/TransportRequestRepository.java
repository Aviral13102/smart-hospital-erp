package com.smarthospital.transport.repository;

import com.smarthospital.transport.entity.TransportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRequestRepository extends JpaRepository<TransportRequest, Long> {

    List<TransportRequest> findByStatus(TransportRequest.RequestStatus status);

    List<TransportRequest> findByAssignedPorterId(String porterId);

    List<TransportRequest> findByPatientId(Long patientId);

    @Query("SELECT t FROM TransportRequest t WHERE t.status IN ('PENDING', 'ASSIGNED', 'IN_TRANSIT') ORDER BY t.priority DESC, t.requestedAt ASC")
    List<TransportRequest> findActiveRequests();

    @Query("SELECT t FROM TransportRequest t WHERE t.status = 'PENDING' ORDER BY t.priority DESC, t.requestedAt ASC")
    List<TransportRequest> findPendingRequests();

    @Query("SELECT t FROM TransportRequest t WHERE t.assignedPorterId = :porterId AND t.status IN ('ASSIGNED', 'IN_TRANSIT') ORDER BY t.priority DESC")
    List<TransportRequest> findActiveRequestsByPorter(String porterId);

    @Query("SELECT COUNT(t) FROM TransportRequest t WHERE t.status = 'PENDING'")
    Long countPendingRequests();

    @Query("SELECT COUNT(t) FROM TransportRequest t WHERE t.assignedPorterId = :porterId AND t.status IN ('ASSIGNED', 'IN_TRANSIT')")
    Long countActiveByPorter(String porterId);
}
