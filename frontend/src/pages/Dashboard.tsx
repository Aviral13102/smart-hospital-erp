import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    Users,
    BedDouble,
    Activity,
    Truck,
    Calendar,
    TrendingUp,
    ArrowRight,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const stats = [
        { title: 'Total Patients Today', value: '124', icon: <Users style={{ width: '24px', height: '24px' }} />, trend: 12, color: 'blue' as const },
        { title: 'Beds Available', value: '42', icon: <BedDouble style={{ width: '24px', height: '24px' }} />, trend: -5, color: 'green' as const },
        { title: 'Active Transports', value: '8', icon: <Truck style={{ width: '24px', height: '24px' }} />, trend: 0, color: 'yellow' as const },
        { title: 'Pending Lab Samples', value: '23', icon: <Activity style={{ width: '24px', height: '24px' }} />, trend: 8, color: 'purple' as const },
    ];

    const quickActions = [
        { label: 'Register Patient', path: '/opd', icon: <Users style={{ width: '20px', height: '20px' }} /> },
        { label: 'Book Appointment', path: '/opd', icon: <Calendar style={{ width: '20px', height: '20px' }} /> },
        { label: 'Allocate Bed', path: '/icu', icon: <BedDouble style={{ width: '20px', height: '20px' }} /> },
        { label: 'Request Transport', path: '/transport', icon: <Truck style={{ width: '20px', height: '20px' }} /> },
    ];

    const recentActivity = [
        { time: '10:45 AM', action: 'Patient John Smith admitted to ICU-003', type: 'admission' },
        { time: '10:32 AM', action: 'Lab sample BLD-12345 marked as complete', type: 'lab' },
        { time: '10:15 AM', action: 'Transport request completed for Room 302', type: 'transport' },
        { time: '09:58 AM', action: 'Nurse Mary Johnson checked in for morning shift', type: 'nursing' },
        { time: '09:45 AM', action: 'Bed GEN-004 marked for cleaning', type: 'housekeeping' },
    ];

    const getActivityColor = (type: string) => {
        const colors: Record<string, string> = {
            admission: 'var(--color-error)',
            lab: 'var(--color-info)',
            transport: 'var(--color-warning)',
            nursing: 'var(--color-success)',
            housekeeping: '#7c3aed'
        };
        return colors[type] || 'var(--color-text-muted)';
    };

    return (
        <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your hospital overview.">
            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                }}
            >
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        color={stat.color}
                    />
                ))}
            </div>

            {/* Two Column Layout */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                }}
            >
                {/* Quick Actions */}
                <Card>
                    <CardHeader
                        title="Quick Actions"
                        subtitle="Common operations"
                        action={<TrendingUp style={{ width: '20px', height: '20px', color: 'var(--color-text-muted)' }} />}
                    />
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '12px'
                        }}
                    >
                        {quickActions.map((action, idx) => (
                            <Link key={idx} to={action.path} style={{ textDecoration: 'none' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                        e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            backgroundColor: 'var(--color-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}
                                    >
                                        {action.icon}
                                    </div>
                                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                        {action.label}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader
                        title="Recent Activity"
                        subtitle="Latest updates"
                        action={
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
                            </Button>
                        }
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentActivity.map((activity, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--color-bg-secondary)'
                                }}
                            >
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: getActivityColor(activity.type),
                                        marginTop: '6px',
                                        flexShrink: 0
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', margin: 0 }}>
                                        {activity.action}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <Clock style={{ width: '12px', height: '12px', color: 'var(--color-text-muted)' }} />
                                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Module Overview */}
            <Card>
                <CardHeader title="Module Overview" subtitle="Access all hospital modules" />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}
                >
                    {[
                        { name: 'OPD Management', path: '/opd', icon: <Users />, color: '#0073bb' },
                        { name: 'ICU & Beds', path: '/icu', icon: <BedDouble />, color: '#d13212' },
                        { name: 'Transport', path: '/transport', icon: <Truck />, color: '#b45309' },
                        { name: 'Lab Samples', path: '/lab', icon: <Activity />, color: '#7c3aed' },
                    ].map((module, idx) => (
                        <Link key={idx} to={module.path} style={{ textDecoration: 'none' }}>
                            <div
                                style={{
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = module.color;
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        backgroundColor: module.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}
                                >
                                    {module.icon}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                                        {module.name}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                                        Click to open
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>
        </DashboardLayout>
    );
}
