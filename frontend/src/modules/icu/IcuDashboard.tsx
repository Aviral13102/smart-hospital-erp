import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { BedDouble, Users, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import type { Bed } from '../../types';

// Demo data - commented out, using real API
/*
const demoBeds: Bed[] = [
    { id: 1, bedNumber: 'ICU-001', ward: 'ICU', floor: '3', type: 'ICU', status: 'OCCUPIED', features: 'Ventilator, Monitor', dailyRate: 5000 },
    { id: 2, bedNumber: 'ICU-002', ward: 'ICU', floor: '3', type: 'ICU', status: 'AVAILABLE', features: 'Ventilator, Monitor', dailyRate: 5000 },
    ...
];
*/

const getTypeGradient = (type: Bed['type']): string => {
    switch (type) {
        case 'ICU': return 'linear-gradient(135deg, #d13212 0%, #f85149 100%)';
        case 'HDU': return 'linear-gradient(135deg, #b45309 0%, #d97706 100%)';
        case 'CCU': return 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)';
        case 'PRIVATE': return 'linear-gradient(135deg, #0073bb 0%, #00a1c9 100%)';
        default: return 'linear-gradient(135deg, #545b64 0%, #8b949e 100%)';
    }
};

export function IcuDashboard() {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>('all');
    const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
    const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state for admission
    const [admissionForm, setAdmissionForm] = useState({
        patientId: '',
        doctorId: '',
        doctorName: '',
        admissionType: 'EMERGENCY',
        diagnosis: '',
        notes: '',
        expectedDischarge: ''
    });

    // Form state for new bed
    const [bedForm, setBedForm] = useState({
        bedNumber: '',
        ward: '',
        floor: '',
        type: 'GENERAL',
        features: '',
        dailyRate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const bedsData = await api.beds.getAll();
            setBeds(bedsData || []);
        } catch (err) {
            console.error('Error fetching beds:', err);
            setError('Failed to load beds. Make sure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBed = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.beds.create({
                bedNumber: bedForm.bedNumber,
                ward: bedForm.ward,
                floor: bedForm.floor,
                type: bedForm.type,
                features: bedForm.features,
                dailyRate: parseFloat(bedForm.dailyRate) || 0,
                status: 'AVAILABLE'
            });
            setIsAddBedModalOpen(false);
            setBedForm({ bedNumber: '', ward: '', floor: '', type: 'GENERAL', features: '', dailyRate: '' });
            fetchData();
        } catch (err) {
            console.error('Error creating bed:', err);
            alert('Failed to add bed. Check backend connection.');
        }
    };

    const handleAdmitPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBed) return;
        try {
            const doctorNames: Record<string, string> = {
                'DOC-001': 'Dr. Anderson',
                'DOC-002': 'Dr. Martinez',
                'DOC-003': 'Dr. Lee'
            };
            await api.admissions.admit({
                patientId: parseInt(admissionForm.patientId),
                bedId: selectedBed.id,
                admittingDoctorId: admissionForm.doctorId,
                admittingDoctorName: doctorNames[admissionForm.doctorId] || 'Doctor',
                admissionType: admissionForm.admissionType,
                diagnosis: admissionForm.diagnosis,
                admissionNotes: admissionForm.notes,
                expectedDischarge: admissionForm.expectedDischarge
            });
            setIsAdmissionModalOpen(false);
            setAdmissionForm({ patientId: '', doctorId: '', doctorName: '', admissionType: 'EMERGENCY', diagnosis: '', notes: '', expectedDischarge: '' });
            fetchData();
        } catch (err) {
            console.error('Error admitting patient:', err);
            alert('Failed to admit patient. Check backend connection.');
        }
    };

    const wards = ['all', ...new Set(beds.map(b => b.ward))];
    const filteredBeds = selectedWard === 'all' ? beds : beds.filter(b => b.ward === selectedWard);

    const stats = {
        total: beds.length,
        available: beds.filter(b => b.status === 'AVAILABLE').length,
        occupied: beds.filter(b => b.status === 'OCCUPIED').length,
        icuAvailable: beds.filter(b => b.type === 'ICU' && b.status === 'AVAILABLE').length,
    };

    const handleBedClick = (bed: Bed) => {
        setSelectedBed(bed);
        if (bed.status === 'AVAILABLE') {
            setIsAdmissionModalOpen(true);
        }
    };

    return (
        <DashboardLayout title="ICU & Bed Allocation" subtitle="Real-time bed management and patient admission">
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="Total Beds" value={stats.total} icon={<BedDouble style={{ width: '24px', height: '24px' }} />} color="blue" />
                <StatCard title="Available" value={stats.available} icon={<BedDouble style={{ width: '24px', height: '24px' }} />} color="green" />
                <StatCard title="Occupied" value={stats.occupied} icon={<Users style={{ width: '24px', height: '24px' }} />} color="red" />
                <StatCard title="ICU Available" value={stats.icuAvailable} icon={<AlertTriangle style={{ width: '24px', height: '24px' }} />} color="yellow" />
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {wards.map(ward => (
                            <button
                                key={ward}
                                onClick={() => setSelectedWard(ward)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: selectedWard === ward ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                                    color: selectedWard === ward ? '#ffffff' : 'var(--color-text-secondary)',
                                    border: selectedWard === ward ? 'none' : '1px solid var(--color-border)'
                                }}
                            >
                                {ward === 'all' ? 'All Wards' : ward}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="ghost" onClick={fetchData} disabled={isLoading}>
                            <RefreshCw style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Refresh
                        </Button>
                        <Button size="sm" onClick={() => setIsAddBedModalOpen(true)}>
                            <Plus style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Add Bed
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Bed Grid */}
            <Card>
                <CardHeader
                    title="Bed Map"
                    subtitle={isLoading ? 'Loading...' : `${filteredBeds.length} beds in ${selectedWard === 'all' ? 'all wards' : selectedWard}`}
                />
                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading beds...</div>
                ) : filteredBeds.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No beds found. Add a bed to get started.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                        {filteredBeds.map(bed => (
                            <button
                                key={bed.id}
                                onClick={() => handleBedClick(bed)}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    textAlign: 'left',
                                    cursor: bed.status === 'AVAILABLE' ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: bed.status === 'AVAILABLE' ? 'var(--color-success-bg)' :
                                        bed.status === 'OCCUPIED' ? 'var(--color-error-bg)' :
                                            bed.status === 'MAINTENANCE' ? 'var(--color-bg-tertiary)' : 'var(--color-warning-bg)',
                                    border: `2px solid ${bed.status === 'AVAILABLE' ? 'var(--color-success)' :
                                        bed.status === 'OCCUPIED' ? 'var(--color-error)' :
                                            bed.status === 'MAINTENANCE' ? 'var(--color-text-muted)' : 'var(--color-warning)'}`
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '8px',
                                        background: getTypeGradient(bed.type)
                                    }}
                                >
                                    <BedDouble style={{ width: '16px', height: '16px', color: 'white' }} />
                                </div>
                                <p style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-text-primary)', margin: 0 }}>{bed.bedNumber}</p>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '4px 0' }}>{bed.type}</p>
                                <Badge variant={bed.status === 'AVAILABLE' ? 'success' : bed.status === 'OCCUPIED' ? 'danger' : 'default'} size="sm">
                                    {bed.status}
                                </Badge>
                            </button>
                        ))}
                    </div>
                )}
            </Card>

            {/* Legend */}
            <Card>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--color-success)' }}></div>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--color-error)' }}></div>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Occupied</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--color-text-muted)' }}></div>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Maintenance</span>
                    </div>
                </div>
            </Card>

            {/* Add Bed Modal */}
            <Modal isOpen={isAddBedModalOpen} onClose={() => setIsAddBedModalOpen(false)} title="Add New Bed" size="md">
                <form onSubmit={handleAddBed}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input label="Bed Number" placeholder="ICU-005" required value={bedForm.bedNumber} onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })} />
                        <Input label="Ward" placeholder="ICU" required value={bedForm.ward} onChange={(e) => setBedForm({ ...bedForm, ward: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input label="Floor" placeholder="3" value={bedForm.floor} onChange={(e) => setBedForm({ ...bedForm, floor: e.target.value })} />
                        <Select label="Bed Type" value={bedForm.type} onChange={(e: any) => setBedForm({ ...bedForm, type: e.target.value })} options={[
                            { value: 'GENERAL', label: 'General' },
                            { value: 'ICU', label: 'ICU' },
                            { value: 'HDU', label: 'HDU' },
                            { value: 'CCU', label: 'CCU' },
                            { value: 'PRIVATE', label: 'Private' },
                        ]} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Features" placeholder="Ventilator, Monitor" value={bedForm.features} onChange={(e) => setBedForm({ ...bedForm, features: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Daily Rate" type="number" placeholder="5000" value={bedForm.dailyRate} onChange={(e) => setBedForm({ ...bedForm, dailyRate: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsAddBedModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Bed</Button>
                    </div>
                </form>
            </Modal>

            {/* Admission Modal */}
            <Modal isOpen={isAdmissionModalOpen} onClose={() => setIsAdmissionModalOpen(false)} title={`Admit Patient to ${selectedBed?.bedNumber}`} size="lg">
                <form onSubmit={handleAdmitPatient}>
                    <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', backgroundColor: 'var(--color-info-bg)', border: '1px solid var(--color-info)' }}>
                        <p style={{ fontSize: '14px', color: 'var(--color-info)', margin: 0 }}>
                            <strong>Bed:</strong> {selectedBed?.bedNumber} | <strong>Ward:</strong> {selectedBed?.ward} | <strong>Type:</strong> {selectedBed?.type}
                        </p>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Patient ID" placeholder="Enter patient ID" required value={admissionForm.patientId} onChange={(e) => setAdmissionForm({ ...admissionForm, patientId: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Select label="Admitting Doctor" value={admissionForm.doctorId} onChange={(e: any) => setAdmissionForm({ ...admissionForm, doctorId: e.target.value })} options={[
                            { value: '', label: 'Select doctor' },
                            { value: 'DOC-001', label: 'Dr. Anderson' },
                            { value: 'DOC-002', label: 'Dr. Martinez' },
                            { value: 'DOC-003', label: 'Dr. Lee' },
                        ]} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Select label="Admission Type" value={admissionForm.admissionType} onChange={(e: any) => setAdmissionForm({ ...admissionForm, admissionType: e.target.value })} options={[
                            { value: 'EMERGENCY', label: 'Emergency' },
                            { value: 'ELECTIVE', label: 'Elective' },
                            { value: 'TRANSFER_IN', label: 'Transfer In' },
                        ]} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Primary Diagnosis" placeholder="Enter diagnosis" value={admissionForm.diagnosis} onChange={(e) => setAdmissionForm({ ...admissionForm, diagnosis: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Textarea label="Admission Notes" placeholder="Additional notes" value={admissionForm.notes} onChange={(e: any) => setAdmissionForm({ ...admissionForm, notes: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Expected Discharge Date" type="date" value={admissionForm.expectedDischarge} onChange={(e) => setAdmissionForm({ ...admissionForm, expectedDischarge: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsAdmissionModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Admit Patient</Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
