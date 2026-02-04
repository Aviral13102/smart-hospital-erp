import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { Users, Calendar, Clock, Plus, Search, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import type { Patient, Appointment } from '../../types';

// Demo data - commented out, using real API
/*
const demoPatients: Patient[] = [
    { id: 1, medicalRecordNumber: 'MRN-001234', firstName: 'John', lastName: 'Smith', gender: 'MALE', phone: '+1-555-0101', dateOfBirth: '1980-05-15', bloodGroup: 'A+' },
    { id: 2, medicalRecordNumber: 'MRN-001235', firstName: 'Sarah', lastName: 'Johnson', gender: 'FEMALE', phone: '+1-555-0102', dateOfBirth: '1992-08-22', bloodGroup: 'O-' },
    { id: 3, medicalRecordNumber: 'MRN-001236', firstName: 'Michael', lastName: 'Williams', gender: 'MALE', phone: '+1-555-0103', dateOfBirth: '1975-12-03', bloodGroup: 'B+' },
    { id: 4, medicalRecordNumber: 'MRN-001237', firstName: 'Emily', lastName: 'Brown', gender: 'FEMALE', phone: '+1-555-0104', dateOfBirth: '1988-03-10', bloodGroup: 'AB+' },
];

const demoAppointments: Appointment[] = [
    { id: 1, patientId: 1, doctorId: 'DOC-001', doctorName: 'Dr. Anderson', department: 'General Medicine', scheduledTime: '2026-02-03T09:00:00', tokenNumber: 1, status: 'COMPLETED' },
    { id: 2, patientId: 2, doctorId: 'DOC-002', doctorName: 'Dr. Martinez', department: 'Cardiology', scheduledTime: '2026-02-03T09:30:00', tokenNumber: 2, status: 'IN_CONSULTATION' },
    { id: 3, patientId: 3, doctorId: 'DOC-001', doctorName: 'Dr. Anderson', department: 'General Medicine', scheduledTime: '2026-02-03T10:00:00', tokenNumber: 3, status: 'IN_QUEUE' },
    { id: 4, patientId: 4, doctorId: 'DOC-003', doctorName: 'Dr. Lee', department: 'Orthopedics', scheduledTime: '2026-02-03T10:30:00', tokenNumber: 4, status: 'CHECKED_IN' },
];
*/

export function OpdDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state for new patient
    const [patientForm, setPatientForm] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        address: ''
    });

    // Form state for new appointment
    const [appointmentForm, setAppointmentForm] = useState({
        patientId: '',
        department: '',
        doctorId: '',
        doctorName: '',
        scheduledTime: '',
        reason: ''
    });

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [patientsData, appointmentsData] = await Promise.all([
                api.patients.getAll(),
                api.appointments.getAll()
            ]);
            setPatients(patientsData || []);
            setAppointments(appointmentsData || []);
        } catch (err) {
            console.error('Error fetching OPD data:', err);
            setError('Failed to load data. Make sure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePatient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patients.create({
                firstName: patientForm.firstName,
                lastName: patientForm.lastName,
                dateOfBirth: patientForm.dateOfBirth,
                gender: patientForm.gender,
                phone: patientForm.phone,
                email: patientForm.email,
                address: patientForm.address
            });
            setIsPatientModalOpen(false);
            setPatientForm({ firstName: '', lastName: '', dateOfBirth: '', gender: '', phone: '', email: '', address: '' });
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Error creating patient:', err);
            alert('Failed to create patient. Check backend connection.');
        }
    };

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const doctorNames: Record<string, string> = {
                'DOC-001': 'Dr. Anderson',
                'DOC-002': 'Dr. Martinez',
                'DOC-003': 'Dr. Lee'
            };
            await api.appointments.create({
                patientId: parseInt(appointmentForm.patientId),
                department: appointmentForm.department,
                doctorId: appointmentForm.doctorId,
                doctorName: doctorNames[appointmentForm.doctorId] || 'Doctor',
                scheduledTime: appointmentForm.scheduledTime,
                reason: appointmentForm.reason
            });
            setIsAppointmentModalOpen(false);
            setAppointmentForm({ patientId: '', department: '', doctorId: '', doctorName: '', scheduledTime: '', reason: '' });
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Error creating appointment:', err);
            alert('Failed to schedule appointment. Check backend connection.');
        }
    };

    const filteredPatients = patients.filter(p =>
        p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.medicalRecordNumber?.includes(searchQuery)
    );

    const patientColumns = [
        { header: 'MRN', accessor: 'medicalRecordNumber' as keyof Patient },
        { header: 'Name', accessor: (p: Patient) => `${p.firstName} ${p.lastName}` },
        { header: 'Gender', accessor: 'gender' as keyof Patient },
        { header: 'Phone', accessor: 'phone' as keyof Patient },
        { header: 'Blood Group', accessor: 'bloodGroup' as keyof Patient },
    ];

    const appointmentColumns = [
        { header: 'Token', accessor: (a: Appointment) => <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>#{a.tokenNumber}</span> },
        {
            header: 'Patient', accessor: (a: Appointment) => {
                const patient = patients.find(p => p.id === a.patientId);
                return patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${a.patientId}`;
            }
        },
        { header: 'Doctor', accessor: 'doctorName' as keyof Appointment },
        { header: 'Department', accessor: 'department' as keyof Appointment },
        { header: 'Time', accessor: (a: Appointment) => new Date(a.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { header: 'Status', accessor: (a: Appointment) => <StatusBadge status={a.status || 'SCHEDULED'} /> },
    ];

    // Stats calculations
    const todayPatients = appointments.length;
    const inQueue = appointments.filter(a => a.status === 'IN_QUEUE' || a.status === 'CHECKED_IN').length;
    const completed = appointments.filter(a => a.status === 'COMPLETED').length;

    return (
        <DashboardLayout title="OPD Management" subtitle="Patient flow and appointment scheduling">
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="Today's Patients" value={String(todayPatients)} icon={<Users style={{ width: '24px', height: '24px' }} />} color="blue" />
                <StatCard title="Total Patients" value={String(patients.length)} icon={<Calendar style={{ width: '24px', height: '24px' }} />} color="green" />
                <StatCard title="In Queue" value={String(inQueue)} icon={<Clock style={{ width: '24px', height: '24px' }} />} color="yellow" />
                <StatCard title="Completed" value={String(completed)} icon={<Users style={{ width: '24px', height: '24px' }} />} color="purple" />
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '16px',
                    marginBottom: '24px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-error-bg)',
                    color: 'var(--color-error)',
                    border: '1px solid var(--color-error)'
                }}>
                    {error}
                </div>
            )}

            {/* Action Bar */}
            <Card>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <Button onClick={() => setIsPatientModalOpen(true)}>
                            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> New Patient
                        </Button>
                        <Button variant="outline" onClick={() => setIsAppointmentModalOpen(true)}>
                            <Calendar style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Schedule Appointment
                        </Button>
                        <Button variant="ghost" onClick={fetchData} disabled={isLoading}>
                            <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Refresh
                        </Button>
                    </div>
                    <div style={{ position: 'relative', width: '280px' }}>
                        <Search
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '20px',
                                height: '20px',
                                color: 'var(--color-text-muted)'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                paddingLeft: '40px',
                                paddingRight: '16px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-primary)',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
            </Card>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {/* Appointments */}
                <Card>
                    <CardHeader title="Today's Appointments" subtitle={isLoading ? 'Loading...' : `${appointments.length} appointments`} />
                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                    ) : (
                        <Table data={appointments} columns={appointmentColumns} emptyMessage="No appointments scheduled" />
                    )}
                </Card>

                {/* Patients */}
                <Card>
                    <CardHeader title="Patient Registry" subtitle={isLoading ? 'Loading...' : `${filteredPatients.length} patients found`} />
                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                    ) : (
                        <Table data={filteredPatients} columns={patientColumns} emptyMessage="No patients registered" />
                    )}
                </Card>
            </div>

            {/* New Patient Modal */}
            <Modal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} title="Register New Patient" size="lg">
                <form onSubmit={handleCreatePatient}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input
                            label="First Name"
                            placeholder="John"
                            required
                            value={patientForm.firstName}
                            onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Smith"
                            required
                            value={patientForm.lastName}
                            onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input
                            label="Date of Birth"
                            type="date"
                            value={patientForm.dateOfBirth}
                            onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                        />
                        <Select
                            label="Gender"
                            value={patientForm.gender}
                            onChange={(e: any) => setPatientForm({ ...patientForm, gender: e.target.value })}
                            options={[
                                { value: '', label: 'Select gender' },
                                { value: 'MALE', label: 'Male' },
                                { value: 'FEMALE', label: 'Female' },
                                { value: 'OTHER', label: 'Other' },
                            ]}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input
                            label="Phone"
                            placeholder="+1-555-0100"
                            value={patientForm.phone}
                            onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="patient@email.com"
                            value={patientForm.email}
                            onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                        />
                    </div>
                    <Textarea
                        label="Address"
                        placeholder="Full address"
                        value={patientForm.address}
                        onChange={(e: any) => setPatientForm({ ...patientForm, address: e.target.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsPatientModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Patient</Button>
                    </div>
                </form>
            </Modal>

            {/* Schedule Appointment Modal */}
            <Modal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} title="Schedule Appointment" size="md">
                <form onSubmit={handleCreateAppointment}>
                    <div style={{ marginBottom: '16px' }}>
                        <Select
                            label="Patient"
                            value={appointmentForm.patientId}
                            onChange={(e: any) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
                            options={[
                                { value: '', label: 'Select patient' },
                                ...patients.map(p => ({ value: String(p.id), label: `${p.firstName} ${p.lastName} (${p.medicalRecordNumber || 'No MRN'})` }))
                            ]}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Select
                            label="Department"
                            value={appointmentForm.department}
                            onChange={(e: any) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                            options={[
                                { value: '', label: 'Select department' },
                                { value: 'General Medicine', label: 'General Medicine' },
                                { value: 'Cardiology', label: 'Cardiology' },
                                { value: 'Orthopedics', label: 'Orthopedics' },
                                { value: 'Pediatrics', label: 'Pediatrics' },
                            ]}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Select
                            label="Doctor"
                            value={appointmentForm.doctorId}
                            onChange={(e: any) => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}
                            options={[
                                { value: '', label: 'Select doctor' },
                                { value: 'DOC-001', label: 'Dr. Anderson' },
                                { value: 'DOC-002', label: 'Dr. Martinez' },
                                { value: 'DOC-003', label: 'Dr. Lee' },
                            ]}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input
                            label="Date & Time"
                            type="datetime-local"
                            value={appointmentForm.scheduledTime}
                            onChange={(e) => setAppointmentForm({ ...appointmentForm, scheduledTime: e.target.value })}
                        />
                    </div>
                    <Textarea
                        label="Reason for Visit"
                        placeholder="Brief description of symptoms or reason"
                        value={appointmentForm.reason}
                        onChange={(e: any) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsAppointmentModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Schedule</Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
