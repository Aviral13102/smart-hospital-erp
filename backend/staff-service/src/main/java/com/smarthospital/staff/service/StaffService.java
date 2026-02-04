package com.smarthospital.staff.service;

import com.smarthospital.staff.entity.Staff;
import com.smarthospital.staff.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;

    @Autowired
    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public Optional<Staff> getStaffByEmployeeId(String employeeId) {
        return staffRepository.findByEmployeeId(employeeId);
    }

    public List<Staff> getStaffByRole(Staff.StaffRole role) {
        return staffRepository.findActiveByRole(role);
    }

    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findActiveByDepartment(department);
    }

    public List<Staff> searchStaff(String searchTerm) {
        return staffRepository.searchStaff(searchTerm);
    }

    public Staff createStaff(Staff staff) {
        if (staff.getEmployeeId() == null || staff.getEmployeeId().isEmpty()) {
            staff.setEmployeeId(generateEmployeeId(staff.getRole()));
        }
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        return staffRepository.findById(id)
                .map(staff -> {
                    staff.setFirstName(staffDetails.getFirstName());
                    staff.setLastName(staffDetails.getLastName());
                    staff.setDepartment(staffDetails.getDepartment());
                    staff.setWard(staffDetails.getWard());
                    staff.setSpecialization(staffDetails.getSpecialization());
                    staff.setPhone(staffDetails.getPhone());
                    staff.setEmail(staffDetails.getEmail());
                    staff.setQualifications(staffDetails.getQualifications());
                    staff.setLicenseNumber(staffDetails.getLicenseNumber());
                    staff.setLicenseExpiry(staffDetails.getLicenseExpiry());
                    return staffRepository.save(staff);
                })
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    public Staff updateStatus(Long id, Staff.EmploymentStatus status) {
        return staffRepository.findById(id)
                .map(staff -> {
                    staff.setStatus(status);
                    return staffRepository.save(staff);
                })
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }

    private String generateEmployeeId(Staff.StaffRole role) {
        String prefix = switch (role) {
            case DOCTOR -> "DOC";
            case NURSE -> "NUR";
            case PORTER -> "POR";
            case LAB_TECHNICIAN -> "LAB";
            case PHARMACIST -> "PHR";
            default -> "EMP";
        };
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
