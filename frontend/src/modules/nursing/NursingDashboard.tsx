import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { UserCog, Calendar, Clock, Plus, LogIn, LogOut, RefreshCw, UserPlus } from 'lucide-react';
import { api } from '../../lib/api';
import type { Staff, Shift } from '../../types';

const getShiftGradient = (type: Shift['shiftType']): string => {
    switch (type) {
        case 'MORNING': return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
        case 'AFTERNOON': return 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)';
        case 'NIGHT': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
        default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
};

export function NursingDashboard() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Shift form state
    const [shiftForm, setShiftForm] = useState({
        staffId: '',
        shiftDate: new Date().toISOString().split('T')[0],
        shiftType: 'MORNING',
        ward: ''
    });

    // Staff form state
    const [staffForm, setStaffForm] = useState({
        firstName: '',
        lastName: '',
        employeeId: '',
        role: 'NURSE',
        department: 'Nursing',
        ward: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [staffData, shiftsData] = await Promise.all([
                api.staff.getAll(),
                api.shifts.getAll()
            ]);
            setStaff(staffData || []);
            setShifts(shiftsData || []);
        } catch (err) {
            console.error('Error fetching nursing data:', err);
            setError('Failed to load data. Make sure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleShift = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const shiftTimes: Record<string, { start: string; end: string }> = {
                'MORNING': { start: '06:00', end: '14:00' },
                'AFTERNOON': { start: '14:00', end: '22:00' },
                'NIGHT': { start: '22:00', end: '06:00' }
            };
            const times = shiftTimes[shiftForm.shiftType];
            await api.shifts.create({
                staffId: parseInt(shiftForm.staffId),
                shiftDate: shiftForm.shiftDate,
                shiftType: shiftForm.shiftType,
                startTime: times.start,
                endTime: times.end,
                ward: shiftForm.ward
            });
            setIsShiftModalOpen(false);
            setShiftForm({ staffId: '', shiftDate: new Date().toISOString().split('T')[0], shiftType: 'MORNING', ward: '' });
            fetchData();
        } catch (err) {
            console.error('Error scheduling shift:', err);
            alert('Failed to schedule shift. Check backend connection.');
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Generate employee ID if not provided
            const empId = staffForm.employeeId || `NUR-${Date.now().toString(36).toUpperCase().slice(-6)}`;

            await api.staff.create({
                firstName: staffForm.firstName,
                lastName: staffForm.lastName,
                employeeId: empId,
                role: staffForm.role,
                department: staffForm.department,
                ward: staffForm.ward,
                phone: staffForm.phone,
                email: staffForm.email,
                status: 'ACTIVE'
            });
            setIsStaffModalOpen(false);
            setStaffForm({
                firstName: '',
                lastName: '',
                employeeId: '',
                role: 'NURSE',
                department: 'Nursing',
                ward: '',
                phone: '',
                email: ''
            });
            fetchData();
        } catch (err) {
            console.error('Error adding staff:', err);
            alert('Failed to add staff. Check backend connection.');
        }
    };

    const handleCheckIn = async (shiftId: number) => {
        try {
            await api.shifts.checkIn(shiftId);
            fetchData();
        } catch (err) {
            console.error('Error checking in:', err);
            alert('Failed to check in. Check backend connection.');
        }
    };

    const handleCheckOut = async (shiftId: number) => {
        try {
            await api.shifts.checkOut(shiftId);
            fetchData();
        } catch (err) {
            console.error('Error checking out:', err);
            alert('Failed to check out. Check backend connection.');
        }
    };

    const todayShifts = shifts.filter(s => s.shiftDate === selectedDate);
    const staffWithShifts = todayShifts.map(shift => ({
        ...shift,
        staff: staff.find(s => s.id === shift.staffId)
    }));

    const stats = {
        onDuty: todayShifts.filter(s => s.status === 'IN_PROGRESS').length,
        scheduled: todayShifts.filter(s => s.status === 'SCHEDULED').length,
        totalStaff: staff.filter(s => s.status === 'ACTIVE').length,
        onLeave: staff.filter(s => s.status === 'ON_LEAVE').length,
    };

    const shiftColumns = [
        {
            header: 'Staff',
            accessor: (s: typeof staffWithShifts[0]) => (
                <div>
                    <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>{s.staff?.firstName} {s.staff?.lastName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>{s.staff?.employeeId}</p>
                </div>
            )
        },
        {
            header: 'Shift',
            accessor: (s: typeof staffWithShifts[0]) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getShiftGradient(s.shiftType) }}></div>
                    <span>{s.shiftType}</span>
                </div>
            )
        },
        { header: 'Time', accessor: (s: typeof staffWithShifts[0]) => `${s.startTime} - ${s.endTime}` },
        { header: 'Ward', accessor: 'ward' as keyof typeof staffWithShifts[0] },
        { header: 'Status', accessor: (s: typeof staffWithShifts[0]) => <StatusBadge status={s.status || 'SCHEDULED'} /> },
        {
            header: 'Actions',
            accessor: (s: typeof staffWithShifts[0]) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {s.status === 'SCHEDULED' && (
                        <Button size="sm" variant="primary" onClick={() => handleCheckIn(s.id!)}>
                            <LogIn style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Check In
                        </Button>
                    )}
                    {s.status === 'IN_PROGRESS' && (
                        <Button size="sm" variant="outline" onClick={() => handleCheckOut(s.id!)}>
                            <LogOut style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Check Out
                        </Button>
                    )}
                </div>
            )
        },
    ];

    const staffColumns = [
        { header: 'Employee ID', accessor: 'employeeId' as keyof Staff },
        { header: 'Name', accessor: (s: Staff) => `${s.firstName} ${s.lastName}` },
        { header: 'Role', accessor: (s: Staff) => <Badge variant="info">{s.role}</Badge> },
        { header: 'Department', accessor: 'department' as keyof Staff },
        { header: 'Ward', accessor: 'ward' as keyof Staff },
        { header: 'Status', accessor: (s: Staff) => <StatusBadge status={s.status || 'ACTIVE'} /> },
    ];

    return (
        <DashboardLayout title="Nursing Roster" subtitle="Shift scheduling and staff attendance">
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="On Duty Now" value={stats.onDuty} icon={<UserCog style={{ width: '24px', height: '24px' }} />} color="green" />
                <StatCard title="Scheduled Today" value={stats.scheduled} icon={<Calendar style={{ width: '24px', height: '24px' }} />} color="blue" />
                <StatCard title="Total Nurses" value={stats.totalStaff} icon={<UserCog style={{ width: '24px', height: '24px' }} />} color="purple" />
                <StatCard title="On Leave" value={stats.onLeave} icon={<Clock style={{ width: '24px', height: '24px' }} />} color="yellow" />
            </div>

            {/* Error */}
            {error && (
                <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
                    {error}
                </div>
            )}

            {/* Action Bar */}
            <Card>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Shift Types:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: getShiftGradient('MORNING') }}></div>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Morning</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: getShiftGradient('AFTERNOON') }}></div>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Afternoon</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: getShiftGradient('NIGHT') }}></div>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Night</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }} />
                        <Button variant="ghost" onClick={fetchData} disabled={isLoading}>
                            <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Refresh
                        </Button>
                        <Button onClick={() => setIsShiftModalOpen(true)}>
                            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Schedule Shift
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {/* Today's Shifts */}
                <Card>
                    <CardHeader title="Today's Shifts" subtitle={isLoading ? 'Loading...' : `${staffWithShifts.length} shifts for ${selectedDate}`} />
                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                    ) : (
                        <Table data={staffWithShifts} columns={shiftColumns} emptyMessage="No shifts scheduled" />
                    )}
                </Card>

                {/* Staff Directory */}
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <CardHeader title="Staff Directory" subtitle={isLoading ? 'Loading...' : `${staff.length} nursing staff`} />
                        <Button onClick={() => setIsStaffModalOpen(true)}>
                            <UserPlus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Add Staff
                        </Button>
                    </div>
                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                    ) : staff.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <UserPlus style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)', marginBottom: '16px' }} />
                            <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>No staff registered yet</p>
                            <Button onClick={() => setIsStaffModalOpen(true)}>
                                <UserPlus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Add Your First Staff Member
                            </Button>
                        </div>
                    ) : (
                        <Table data={staff} columns={staffColumns} emptyMessage="No staff registered" />
                    )}
                </Card>
            </div>

            {/* Schedule Shift Modal */}
            <Modal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} title="Schedule New Shift" size="md">
                <form onSubmit={handleScheduleShift}>
                    {staff.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center' }}>
                            <UserPlus style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)', marginBottom: '16px' }} />
                            <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>You need to add staff members first before scheduling shifts.</p>
                            <Button onClick={() => { setIsShiftModalOpen(false); setIsStaffModalOpen(true); }}>
                                <UserPlus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Add Staff Member
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <Select label="Staff Member" value={shiftForm.staffId} onChange={(e: any) => setShiftForm({ ...shiftForm, staffId: e.target.value })} options={[
                                    { value: '', label: 'Select staff' },
                                    ...staff.filter(s => s.status === 'ACTIVE').map(s => ({ value: String(s.id), label: `${s.firstName} ${s.lastName} (${s.employeeId})` }))
                                ]} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <Input label="Shift Date" type="date" value={shiftForm.shiftDate} onChange={(e) => setShiftForm({ ...shiftForm, shiftDate: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <Select label="Shift Type" value={shiftForm.shiftType} onChange={(e: any) => setShiftForm({ ...shiftForm, shiftType: e.target.value })} options={[
                                    { value: 'MORNING', label: 'Morning (6AM-2PM)' },
                                    { value: 'AFTERNOON', label: 'Afternoon (2PM-10PM)' },
                                    { value: 'NIGHT', label: 'Night (10PM-6AM)' },
                                ]} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <Select label="Ward" value={shiftForm.ward} onChange={(e: any) => setShiftForm({ ...shiftForm, ward: e.target.value })} options={[
                                    { value: '', label: 'Select ward' },
                                    { value: 'ICU', label: 'ICU' },
                                    { value: 'Ward 3', label: 'Ward 3' },
                                    { value: 'ER', label: 'Emergency Room' },
                                    { value: 'PICU', label: 'PICU' },
                                    { value: 'General', label: 'General' },
                                ]} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <Button variant="ghost" type="button" onClick={() => setIsShiftModalOpen(false)}>Cancel</Button>
                                <Button type="submit">Schedule</Button>
                            </div>
                        </>
                    )}
                </form>
            </Modal>

            {/* Add Staff Modal */}
            <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title="Add New Staff Member" size="md">
                <form onSubmit={handleAddStaff}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input
                            label="First Name"
                            value={staffForm.firstName}
                            onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={staffForm.lastName}
                            onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input
                            label="Employee ID (auto-generated if empty)"
                            value={staffForm.employeeId}
                            onChange={(e) => setStaffForm({ ...staffForm, employeeId: e.target.value })}
                            placeholder="e.g. NUR-001"
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Select
                            label="Role"
                            value={staffForm.role}
                            onChange={(e: any) => setStaffForm({ ...staffForm, role: e.target.value })}
                            options={[
                                { value: 'NURSE', label: 'Nurse' },
                                { value: 'HEAD_NURSE', label: 'Head Nurse' },
                                { value: 'NURSE_AIDE', label: 'Nurse Aide' },
                                { value: 'CNA', label: 'Certified Nursing Assistant' },
                            ]}
                        />
                        <Select
                            label="Department"
                            value={staffForm.department}
                            onChange={(e: any) => setStaffForm({ ...staffForm, department: e.target.value })}
                            options={[
                                { value: 'Nursing', label: 'Nursing' },
                                { value: 'ICU', label: 'ICU' },
                                { value: 'Emergency', label: 'Emergency' },
                                { value: 'Pediatrics', label: 'Pediatrics' },
                                { value: 'Surgery', label: 'Surgery' },
                            ]}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Select
                            label="Ward"
                            value={staffForm.ward}
                            onChange={(e: any) => setStaffForm({ ...staffForm, ward: e.target.value })}
                            options={[
                                { value: '', label: 'Select ward' },
                                { value: 'ICU', label: 'ICU' },
                                { value: 'Ward 3', label: 'Ward 3' },
                                { value: 'ER', label: 'Emergency Room' },
                                { value: 'PICU', label: 'PICU' },
                                { value: 'General', label: 'General' },
                            ]}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input
                            label="Phone"
                            type="tel"
                            value={staffForm.phone}
                            onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                            placeholder="+1-555-0100"
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={staffForm.email}
                            onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                            placeholder="nurse@hospital.com"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsStaffModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Staff</Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
