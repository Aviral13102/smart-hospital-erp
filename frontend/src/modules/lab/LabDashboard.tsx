import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { FlaskConical, Truck, Clock, Plus, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import type { LabSample } from '../../types';

// Demo data - commented out, using real API
/*
const demoSamples: LabSample[] = [
    { id: 1, sampleId: 'BLD-A1B2C3D4', patientId: 1, patientName: 'John Smith', medicalRecordNumber: 'MRN-001234', sampleType: 'BLOOD', testName: 'Complete Blood Count', status: 'PROCESSING', priority: 'NORMAL', currentLocation: 'Hematology Lab', orderedAt: '2026-02-03T08:00:00' },
    ...
];
*/

const getTypeIcon = (type: LabSample['sampleType']): string => {
    switch (type) {
        case 'BLOOD': return '🩸';
        case 'URINE': return '💧';
        case 'SWAB': return '🧪';
        case 'STOOL': return '🟤';
        default: return '🔬';
    }
};

export function LabDashboard() {
    const [samples, setSamples] = useState<LabSample[]>([]);
    const [isNewSampleModalOpen, setIsNewSampleModalOpen] = useState(false);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [sampleForm, setSampleForm] = useState({
        patientId: '',
        patientName: '',
        sampleType: 'BLOOD',
        priority: 'NORMAL',
        testName: '',
        testCode: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.samples.getAll();
            setSamples(data || []);
        } catch (err) {
            console.error('Error fetching lab samples:', err);
            setError('Failed to load samples. Make sure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrderTest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.samples.create({
                patientId: parseInt(sampleForm.patientId) || 1,
                patientName: sampleForm.patientName || 'Patient',
                sampleType: sampleForm.sampleType,
                priority: sampleForm.priority,
                testName: sampleForm.testName,
                testCode: sampleForm.testCode,
                notes: sampleForm.notes
            });
            setIsNewSampleModalOpen(false);
            setSampleForm({ patientId: '', patientName: '', sampleType: 'BLOOD', priority: 'NORMAL', testName: '', testCode: '', notes: '' });
            fetchData();
        } catch (err) {
            console.error('Error ordering test:', err);
            alert('Failed to order test. Check backend connection.');
        }
    };

    const handleViewTracking = (sample: LabSample) => {
        setSelectedSample(sample);
        setIsTrackingModalOpen(true);
    };

    const handleCollect = async (id: number) => {
        try {
            await api.samples.collect(id);
            fetchData();
        } catch (err) {
            console.error('Error collecting sample:', err);
            alert('Failed to collect. Check backend connection.');
        }
    };

    const handleReceiveAtLab = async (id: number) => {
        try {
            await api.samples.receive(id);
            fetchData();
        } catch (err) {
            console.error('Error receiving sample:', err);
            alert('Failed to receive. Check backend connection.');
        }
    };

    const stats = {
        ordered: samples.filter(s => s.status === 'ORDERED').length,
        inTransit: samples.filter(s => s.status === 'COLLECTED' || s.status === 'IN_TRANSIT').length,
        processing: samples.filter(s => s.status === 'PROCESSING').length,
        completed: samples.filter(s => s.status === 'COMPLETED' || s.status === 'REPORTED').length,
    };

    const columns = [
        {
            header: 'Sample',
            accessor: (s: LabSample) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{getTypeIcon(s.sampleType)}</span>
                    <div>
                        <p style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>{s.sampleId}</p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>{s.sampleType}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Patient',
            accessor: (s: LabSample) => (
                <div>
                    <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>{s.patientName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>{s.medicalRecordNumber}</p>
                </div>
            )
        },
        { header: 'Test', accessor: 'testName' as keyof LabSample },
        { header: 'Priority', accessor: (s: LabSample) => <PriorityBadge priority={s.priority || 'NORMAL'} /> },
        { header: 'Location', accessor: 'currentLocation' as keyof LabSample },
        { header: 'Status', accessor: (s: LabSample) => <StatusBadge status={s.status || 'ORDERED'} /> },
        {
            header: 'Actions',
            accessor: (s: LabSample) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {s.status === 'ORDERED' && (
                        <Button size="sm" variant="primary" onClick={() => handleCollect(s.id!)}>Collect</Button>
                    )}
                    {(s.status === 'COLLECTED' || s.status === 'IN_TRANSIT') && (
                        <Button size="sm" variant="primary" onClick={() => handleReceiveAtLab(s.id!)}>Receive</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleViewTracking(s)}>Track</Button>
                </div>
            )
        },
    ];

    const trackingSteps = [
        { label: 'Ordered', status: 'ORDERED' },
        { label: 'Collected', status: 'COLLECTED' },
        { label: 'In Transit', status: 'IN_TRANSIT' },
        { label: 'Received', status: 'RECEIVED_AT_LAB' },
        { label: 'Processing', status: 'PROCESSING' },
        { label: 'Completed', status: 'COMPLETED' },
        { label: 'Reported', status: 'REPORTED' },
    ];

    const getStepStatus = (step: typeof trackingSteps[0], sampleStatus: string): 'complete' | 'current' | 'pending' => {
        const statusOrder = ['ORDERED', 'COLLECTED', 'IN_TRANSIT', 'RECEIVED_AT_LAB', 'PROCESSING', 'COMPLETED', 'REPORTED'];
        const currentIndex = statusOrder.indexOf(sampleStatus);
        const stepIndex = statusOrder.indexOf(step.status);

        if (stepIndex < currentIndex) return 'complete';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

    return (
        <DashboardLayout title="Lab Sample Tracking" subtitle="Sample collection, movement, and result tracking">
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="Pending Collection" value={stats.ordered} icon={<Clock style={{ width: '24px', height: '24px' }} />} color="yellow" />
                <StatCard title="In Transit" value={stats.inTransit} icon={<Truck style={{ width: '24px', height: '24px' }} />} color="blue" />
                <StatCard title="Processing" value={stats.processing} icon={<FlaskConical style={{ width: '24px', height: '24px' }} />} color="purple" />
                <StatCard title="Completed Today" value={stats.completed} icon={<CheckCircle2 style={{ width: '24px', height: '24px' }} />} color="green" />
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
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Sample Types:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span>🩸</span><span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Blood</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span>💧</span><span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Urine</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span>🧪</span><span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Swab</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="ghost" onClick={fetchData} disabled={isLoading}>
                            <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Refresh
                        </Button>
                        <Button onClick={() => setIsNewSampleModalOpen(true)}>
                            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Order New Test
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Samples Table */}
            <Card>
                <CardHeader title="Lab Samples" subtitle={isLoading ? 'Loading...' : `${samples.length} samples tracked`} />
                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                ) : (
                    <Table data={samples} columns={columns} emptyMessage="No samples. Order a test to get started." />
                )}
            </Card>

            {/* New Sample Modal */}
            <Modal isOpen={isNewSampleModalOpen} onClose={() => setIsNewSampleModalOpen(false)} title="Order Lab Test" size="lg">
                <form onSubmit={handleOrderTest}>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Patient Name" placeholder="John Smith" required value={sampleForm.patientName} onChange={(e) => setSampleForm({ ...sampleForm, patientName: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Select label="Sample Type" value={sampleForm.sampleType} onChange={(e: any) => setSampleForm({ ...sampleForm, sampleType: e.target.value })} options={[
                            { value: 'BLOOD', label: 'Blood' },
                            { value: 'URINE', label: 'Urine' },
                            { value: 'STOOL', label: 'Stool' },
                            { value: 'SWAB', label: 'Swab' },
                            { value: 'OTHER', label: 'Other' },
                        ]} />
                        <Select label="Priority" value={sampleForm.priority} onChange={(e: any) => setSampleForm({ ...sampleForm, priority: e.target.value })} options={[
                            { value: 'ROUTINE', label: 'Routine' },
                            { value: 'NORMAL', label: 'Normal' },
                            { value: 'URGENT', label: 'Urgent' },
                            { value: 'STAT', label: 'STAT' },
                        ]} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Test Name" placeholder="e.g., Complete Blood Count" required value={sampleForm.testName} onChange={(e) => setSampleForm({ ...sampleForm, testName: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Textarea label="Notes" placeholder="Special instructions" value={sampleForm.notes} onChange={(e: any) => setSampleForm({ ...sampleForm, notes: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsNewSampleModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Order Test</Button>
                    </div>
                </form>
            </Modal>

            {/* Tracking Modal */}
            <Modal isOpen={isTrackingModalOpen} onClose={() => setIsTrackingModalOpen(false)} title="Sample Tracking" size="lg">
                {selectedSample && (
                    <div>
                        <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '32px' }}>{getTypeIcon(selectedSample.sampleType)}</span>
                                <div>
                                    <p style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>{selectedSample.sampleId}</p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>{selectedSample.testName}</p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', fontSize: '14px' }}>
                                <div>
                                    <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Patient</p>
                                    <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>{selectedSample.patientName}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Current Location</p>
                                    <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>{selectedSample.currentLocation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div style={{ overflowX: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '500px', gap: '8px' }}>
                                {trackingSteps.map((step, idx) => {
                                    const stepStatus = getStepStatus(step, selectedSample.status || 'ORDERED');
                                    return (
                                        <div key={step.status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                            <div
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: stepStatus === 'complete' ? 'var(--color-success)' :
                                                        stepStatus === 'current' ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                                                    color: stepStatus === 'pending' ? 'var(--color-text-muted)' : '#ffffff'
                                                }}
                                            >
                                                {stepStatus === 'complete' ? '✓' : idx + 1}
                                            </div>
                                            <p style={{
                                                fontSize: '12px',
                                                marginTop: '8px',
                                                textAlign: 'center',
                                                color: stepStatus === 'current' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                                fontWeight: stepStatus === 'current' ? 500 : 400
                                            }}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
