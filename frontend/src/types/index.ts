export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    department?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    name: string;
    role: string;
    expiresIn: number;
}

// OPD Types
export interface Patient {
    id?: number;
    medicalRecordNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    phone?: string;
    email?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    bloodGroup?: string;
    allergies?: string;
    medicalHistory?: string;
    createdAt?: string;
}

export interface Appointment {
    id?: number;
    patient?: Patient;
    patientId?: number;
    doctorId: string;
    doctorName?: string;
    department: string;
    scheduledTime: string;
    tokenNumber?: number;
    status?: 'SCHEDULED' | 'CHECKED_IN' | 'IN_QUEUE' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    type?: 'NEW_VISIT' | 'FOLLOW_UP' | 'EMERGENCY' | 'REFERRAL';
    reason?: string;
    notes?: string;
}

export interface QueueEntry {
    id: number;
    appointment: Appointment;
    department: string;
    doctorId: string;
    queueNumber: number;
    status: 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED' | 'SKIPPED';
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    estimatedWaitMinutes?: number;
}

// IPD Types
export interface Bed {
    id?: number;
    bedNumber: string;
    ward: string;
    floor?: string;
    type: 'GENERAL' | 'SEMI_PRIVATE' | 'PRIVATE' | 'ICU' | 'HDU' | 'NICU' | 'PICU' | 'CCU' | 'ISOLATION';
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'CLEANING';
    features?: string;
    dailyRate?: number;
}

export interface Admission {
    id?: number;
    patientId: number;
    patientName?: string;
    medicalRecordNumber?: string;
    bed?: Bed;
    admittingDoctorId: string;
    admittingDoctorName?: string;
    primaryDiagnosis?: string;
    admissionNotes?: string;
    status?: 'ADMITTED' | 'IN_TREATMENT' | 'READY_FOR_DISCHARGE' | 'DISCHARGED' | 'TRANSFERRED';
    type?: 'EMERGENCY' | 'ELECTIVE' | 'TRANSFER_IN' | 'DAY_CARE';
    admissionTime?: string;
    expectedDischargeDate?: string;
}

// Transport Types
export interface TransportRequest {
    id?: number;
    patientId: number;
    patientName?: string;
    fromLocation: string;
    toLocation: string;
    transportType: 'WHEELCHAIR' | 'STRETCHER' | 'BED' | 'WALKING_ASSIST' | 'AMBULATORY';
    status?: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY';
    requestedById?: string;
    requestedByName?: string;
    assignedPorterId?: string;
    assignedPorterName?: string;
    notes?: string;
    equipment?: string;
    requiresOxygen?: boolean;
    requiresMonitor?: boolean;
    requestedAt?: string;
}

// Staff Types
export interface Staff {
    id?: number;
    employeeId: string;
    firstName: string;
    lastName: string;
    role: 'DOCTOR' | 'NURSE' | 'PORTER' | 'LAB_TECHNICIAN' | 'PHARMACIST' | 'RECEPTIONIST' | 'ADMIN' | 'HOUSEKEEPING' | 'MAINTENANCE' | 'SECURITY';
    department: string;
    ward?: string;
    specialization?: string;
    phone?: string;
    email?: string;
    status?: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED';
}

export interface Shift {
    id?: number;
    staff?: Staff;
    staffId?: number;
    shiftDate: string;
    shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'GENERAL';
    startTime?: string;
    endTime?: string;
    ward: string;
    department?: string;
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABSENT' | 'SWAPPED' | 'CANCELLED';
}

// Lab Types
export interface LabSample {
    id?: number;
    sampleId?: string;
    patientId: number;
    patientName?: string;
    medicalRecordNumber?: string;
    sampleType: 'BLOOD' | 'URINE' | 'STOOL' | 'SPUTUM' | 'SWAB' | 'TISSUE' | 'CSF' | 'FLUID' | 'OTHER';
    testName: string;
    testCode?: string;
    status?: 'ORDERED' | 'COLLECTED' | 'IN_TRANSIT' | 'RECEIVED_AT_LAB' | 'PROCESSING' | 'COMPLETED' | 'REPORTED' | 'REJECTED';
    priority?: 'ROUTINE' | 'NORMAL' | 'URGENT' | 'STAT';
    currentLocation?: string;
    result?: string;
    orderedAt?: string;
    collectedAt?: string;
}

export interface SampleMovement {
    id: number;
    sample: LabSample;
    fromLocation: string;
    toLocation: string;
    movedById?: string;
    movedByName?: string;
    movementType: 'COLLECTION' | 'HANDOVER' | 'TRANSIT' | 'LAB_RECEIPT' | 'INTERNAL_TRANSFER' | 'ARCHIVAL';
    timestamp: string;
}
