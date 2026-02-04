package com.smarthospital.transport.service;

import com.smarthospital.transport.entity.TransportRequest;
import com.smarthospital.transport.repository.TransportRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TransportService {

    private final TransportRequestRepository transportRequestRepository;

    public List<TransportRequest> getAllRequests() {
        return transportRequestRepository.findAll();
    }

    public List<TransportRequest> getActiveRequests() {
        return transportRequestRepository.findActiveRequests();
    }

    public List<TransportRequest> getPendingRequests() {
        return transportRequestRepository.findPendingRequests();
    }

    public Optional<TransportRequest> getRequestById(Long id) {
        return transportRequestRepository.findById(id);
    }

    public List<TransportRequest> getRequestsByPorter(String porterId) {
        return transportRequestRepository.findActiveRequestsByPorter(porterId);
    }

    public Long getPendingCount() {
        return transportRequestRepository.countPendingRequests();
    }

    public TransportRequest createRequest(TransportRequest request) {
        request.setStatus(TransportRequest.RequestStatus.PENDING);
        request.setRequestedAt(LocalDateTime.now());
        return transportRequestRepository.save(request);
    }

    public TransportRequest assignPorter(Long requestId, String porterId, String porterName) {
        return transportRequestRepository.findById(requestId)
                .map(request -> {
                    request.setAssignedPorterId(porterId);
                    request.setAssignedPorterName(porterName);
                    request.setStatus(TransportRequest.RequestStatus.ASSIGNED);
                    request.setAssignedAt(LocalDateTime.now());
                    return transportRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Transport request not found"));
    }

    public TransportRequest startTransport(Long requestId) {
        return transportRequestRepository.findById(requestId)
                .map(request -> {
                    request.setStatus(TransportRequest.RequestStatus.IN_TRANSIT);
                    request.setPickedUpAt(LocalDateTime.now());
                    return transportRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Transport request not found"));
    }

    public TransportRequest completeTransport(Long requestId) {
        return transportRequestRepository.findById(requestId)
                .map(request -> {
                    request.setStatus(TransportRequest.RequestStatus.DELIVERED);
                    request.setDeliveredAt(LocalDateTime.now());
                    return transportRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Transport request not found"));
    }

    public TransportRequest cancelRequest(Long requestId) {
        return transportRequestRepository.findById(requestId)
                .map(request -> {
                    request.setStatus(TransportRequest.RequestStatus.CANCELLED);
                    return transportRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Transport request not found"));
    }

    public TransportRequest updatePriority(Long requestId, TransportRequest.Priority priority) {
        return transportRequestRepository.findById(requestId)
                .map(request -> {
                    request.setPriority(priority);
                    return transportRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Transport request not found"));
    }
}
