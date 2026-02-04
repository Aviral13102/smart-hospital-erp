import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return {
                    backgroundColor: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                };
            case 'warning':
                return {
                    backgroundColor: 'var(--color-warning-bg)',
                    color: 'var(--color-warning)',
                };
            case 'danger':
                return {
                    backgroundColor: 'var(--color-error-bg)',
                    color: 'var(--color-error)',
                };
            case 'info':
                return {
                    backgroundColor: 'var(--color-info-bg)',
                    color: 'var(--color-info)',
                };
            case 'purple':
                return {
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                };
            default:
                return {
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-secondary)',
                };
        }
    };

    const sizeStyles = {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '6px 12px', fontSize: '14px' },
    };

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 500,
                borderRadius: '9999px',
                ...sizeStyles[size],
                ...getVariantStyles()
            }}
        >
            {children}
        </span>
    );
}

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusMap: Record<string, BadgeProps['variant']> = {
        // General
        'ACTIVE': 'success',
        'INACTIVE': 'default',
        'PENDING': 'warning',
        'COMPLETED': 'success',
        'CANCELLED': 'danger',

        // Appointments
        'SCHEDULED': 'info',
        'CHECKED_IN': 'purple',
        'IN_QUEUE': 'warning',
        'IN_CONSULTATION': 'info',
        'NO_SHOW': 'danger',

        // Beds
        'AVAILABLE': 'success',
        'OCCUPIED': 'danger',
        'RESERVED': 'info',
        'MAINTENANCE': 'default',
        'CLEANING': 'warning',

        // Transport
        'ASSIGNED': 'info',
        'IN_TRANSIT': 'purple',
        'DELIVERED': 'success',

        // Lab
        'ORDERED': 'warning',
        'COLLECTED': 'info',
        'RECEIVED_AT_LAB': 'purple',
        'PROCESSING': 'info',
        'REPORTED': 'success',

        // Shifts
        'IN_PROGRESS': 'info',

        // Staff
        'ON_LEAVE': 'warning',
    };

    const variant = statusMap[status] || 'default';
    const displayText = status.replace(/_/g, ' ');

    return <Badge variant={variant} size="sm">{displayText}</Badge>;
}

interface PriorityBadgeProps {
    priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    const priorityMap: Record<string, BadgeProps['variant']> = {
        'LOW': 'default',
        'NORMAL': 'info',
        'ROUTINE': 'info',
        'HIGH': 'warning',
        'URGENT': 'danger',
        'STAT': 'danger',
        'EMERGENCY': 'danger',
    };

    const variant = priorityMap[priority] || 'default';

    return <Badge variant={variant} size="sm">{priority}</Badge>;
}
