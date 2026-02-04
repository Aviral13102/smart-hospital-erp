import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Truck, Clock, Users, Plus, Play, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import type { TransportRequest } from '../../types';

// Demo data - commented out, using real API
/*
const demoRequests: TransportRequest[] = [
    { id: 1, patientId: 1, patientName: 'John Smith', fromLocation: 'Ward 3, Bed 12', toLocation: 'Radiology', transportType: 'WHEELCHAIR', status: 'PENDING', priority: 'NORMAL', requestedAt: '2026-02-03T09:15:00' },
    ...
];
*/

const porters = [
    { id: 'POR-001', name: 'Mike Porter', status: 'AVAILABLE' },
    { id: 'POR-002', name: 'Tom Carrier', status: 'BUSY' },
    { id: 'POR-003', name: 'Jane Helper', status: 'AVAILABLE' },
    { id: 'POR-004', name: 'Sam Mover', status: 'AVAILABLE' },
];

export function TransportDashboard() {
    const [requests, setRequests] = useState<TransportRequest[]>([]);
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [requestForm, setRequestForm] = useState({
        patientId: '',
        patientName: '',
        fromLocation: '',
        toLocation: '',
        transportType: 'WHEELCHAIR',
        priority: 'NORMAL',
        requiresOxygen: false,
        requiresMonitor: false,
        notes: ''
    });

    const [selectedPorterId, setSelectedPorterId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.transport.getAll();
            setRequests(data || []);
        } catch (err) {
            console.error('Error fetching transport requests:', err);
            setError('Failed to load transport requests. Make sure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.transport.create({
                patientId: parseInt(requestForm.patientId) || 1,
                patientName: requestForm.patientName || 'Patient',
                fromLocation: requestForm.fromLocation,
                toLocation: requestForm.toLocation,
                transportType: requestForm.transportType,
                priority: requestForm.priority,
                requiresOxygen: requestForm.requiresOxygen,
                requiresMonitor: requestForm.requiresMonitor,
                notes: requestForm.notes
            });
            setIsNewRequestModalOpen(false);
            setRequestForm({ patientId: '', patientName: '', fromLocation: '', toLocation: '', transportType: 'WHEELCHAIR', priority: 'NORMAL', requiresOxygen: false, requiresMonitor: false, notes: '' });
            fetchData();
        } catch (err) {
            console.error('Error creating transport request:', err);
            alert('Failed to create request. Check backend connection.');
        }
    };

    const handleAssign = (request: TransportRequest) => {
        setSelectedRequest(request);
        setIsAssignModalOpen(true);
    };

    const handleAssignSubmit = async () => {
        if (!selectedRequest || !selectedPorterId) return;
        try {
            const porter = porters.find(p => p.id === selectedPorterId);
            await api.transport.assign(selectedRequest.id!, selectedPorterId, porter?.name || 'Porter');
            setIsAssignModalOpen(false);
            setSelectedPorterId('');
            fetchData();
        } catch (err) {
            console.error('Error assigning porter:', err);
            alert('Failed to assign porter. Check backend connection.');
        }
    };

    const handleStart = async (id: number) => {
        try {
            await api.transport.start(id);
            fetchData();
        } catch (err) {
            console.error('Error starting transport:', err);
            alert('Failed to start transport. Check backend connection.');
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await api.transport.complete(id);
            fetchData();
        } catch (err) {
            console.error('Error completing transport:', err);
            alert('Failed to complete transport. Check backend connection.');
        }
    };

    const stats = {
        pending: requests.filter(r => r.status === 'PENDING').length,
        active: requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN_TRANSIT').length,
        completed: requests.filter(r => r.status === 'DELIVERED').length,
        availablePorters: porters.filter(p => p.status === 'AVAILABLE').length,
    };

    const columns = [
        { header: 'Patient', accessor: 'patientName' as keyof TransportRequest },
        { header: 'From', accessor: 'fromLocation' as keyof TransportRequest },
        { header: 'To', accessor: 'toLocation' as keyof TransportRequest },
        { header: 'Type', accessor: (r: TransportRequest) => r.transportType?.replace('_', ' ') || 'N/A' },
        { header: 'Priority', accessor: (r: TransportRequest) => <PriorityBadge priority={r.priority || 'NORMAL'} /> },
        { header: 'Status', accessor: (r: TransportRequest) => <StatusBadge status={r.status || 'PENDING'} /> },
        { header: 'Porter', accessor: (r: TransportRequest) => r.assignedPorterName || '-' },
        {
            header: 'Actions',
            accessor: (r: TransportRequest) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {r.status === 'PENDING' && (
                        <Button size="sm" variant="outline" onClick={() => handleAssign(r)}>Assign</Button>
                    )}
                    {r.status === 'ASSIGNED' && (
                        <Button size="sm" variant="primary" onClick={() => handleStart(r.id!)}>
                            <Play style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Start
                        </Button>
                    )}
                    {r.status === 'IN_TRANSIT' && (
                        <Button size="sm" variant="success" onClick={() => handleComplete(r.id!)}>
                            <CheckCircle2 style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Complete
                        </Button>
                    )}
                </div>
            )
        },
    ];

    return (
        <DashboardLayout title="Transport System" subtitle="Internal patient transportation management">
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="Pending Requests" value={stats.pending} icon={<Clock style={{ width: '24px', height: '24px' }} />} color="yellow" />
                <StatCard title="Active Transports" value={stats.active} icon={<Truck style={{ width: '24px', height: '24px' }} />} color="blue" />
                <StatCard title="Completed Today" value={stats.completed} icon={<CheckCircle2 style={{ width: '24px', height: '24px' }} />} color="green" />
                <StatCard title="Available Porters" value={stats.availablePorters} icon={<Users style={{ width: '24px', height: '24px' }} />} color="purple" />
            </div>

            {/* Error */}
            {error && (
                <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
                    {error}
                </div>
            )}

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
                {/* Porter Status */}
                <Card>
                    <CardHeader title="Porter Availability" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {porters.map(porter => (
                            <div
                                key={porter.id}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    backgroundColor: porter.status === 'AVAILABLE' ? 'var(--color-success-bg)' : 'var(--color-bg-secondary)',
                                    border: `1px solid ${porter.status === 'AVAILABLE' ? 'var(--color-success)' : 'var(--color-border)'}`
                                }}
                            >
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: porter.status === 'AVAILABLE' ? 'var(--color-success)' : 'var(--color-text-muted)' }}></div>
                                <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{porter.name}</span>
                                <span style={{ fontSize: '12px', marginLeft: 'auto', color: porter.status === 'AVAILABLE' ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                                    {porter.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Action Card */}
                <Card>
                    <CardHeader title="Quick Actions" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <Button onClick={() => setIsNewRequestModalOpen(true)}>
                            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} /> New Transport Request
                        </Button>
                        <Button variant="ghost" onClick={fetchData} disabled={isLoading}>
                            <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px' }} /> Refresh
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Requests Table */}
            <Card>
                <CardHeader title="Transport Requests" subtitle={isLoading ? 'Loading...' : `${requests.length} requests`} />
                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                ) : (
                    <Table data={requests} columns={columns} emptyMessage="No transport requests" />
                )}
            </Card>

            {/* New Request Modal */}
            <Modal isOpen={isNewRequestModalOpen} onClose={() => setIsNewRequestModalOpen(false)} title="New Transport Request" size="lg">
                <form onSubmit={handleCreateRequest}>
                    <div style={{ marginBottom: '16px' }}>
                        <Input label="Patient Name" placeholder="John Smith" required value={requestForm.patientName} onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Input label="From Location" placeholder="e.g., Ward 3, Bed 12" required value={requestForm.fromLocation} onChange={(e) => setRequestForm({ ...requestForm, fromLocation: e.target.value })} />
                        <Input label="To Location" placeholder="e.g., Radiology" required value={requestForm.toLocation} onChange={(e) => setRequestForm({ ...requestForm, toLocation: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <Select label="Transport Type" value={requestForm.transportType} onChange={(e: any) => setRequestForm({ ...requestForm, transportType: e.target.value })} options={[
                            { value: 'WHEELCHAIR', label: 'Wheelchair' },
                            { value: 'STRETCHER', label: 'Stretcher' },
                            { value: 'BED', label: 'Bed' },
                            { value: 'WALKING_ASSIST', label: 'Walking Assist' },
                        ]} />
                        <Select label="Priority" value={requestForm.priority} onChange={(e: any) => setRequestForm({ ...requestForm, priority: e.target.value })} options={[
                            { value: 'LOW', label: 'Low' },
                            { value: 'NORMAL', label: 'Normal' },
                            { value: 'HIGH', label: 'High' },
                            { value: 'URGENT', label: 'Urgent' },
                            { value: 'EMERGENCY', label: 'Emergency' },
                        ]} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Textarea label="Notes" placeholder="Special instructions" value={requestForm.notes} onChange={(e: any) => setRequestForm({ ...requestForm, notes: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" type="button" onClick={() => setIsNewRequestModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Request</Button>
                    </div>
                </form>
            </Modal>

            {/* Assign Porter Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Porter" size="sm">
                <div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                        Assign a porter to transport <strong style={{ color: 'var(--color-text-primary)' }}>{selectedRequest?.patientName}</strong> from {selectedRequest?.fromLocation} to {selectedRequest?.toLocation}
                    </p>
                    <Select label="Select Porter" value={selectedPorterId} onChange={(e: any) => setSelectedPorterId(e.target.value)} options={[
                        { value: '', label: 'Choose porter' },
                        ...porters.filter(p => p.status === 'AVAILABLE').map(p => ({ value: p.id, label: p.name }))
                    ]} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignSubmit}>Assign</Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
