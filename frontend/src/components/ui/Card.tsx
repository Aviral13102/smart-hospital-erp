import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
    const paddingMap = {
        none: '0',
        sm: '16px',
        md: '24px',
        lg: '32px',
    };

    return (
        <div
            className={className}
            style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: paddingMap[padding],
                boxShadow: 'var(--shadow-sm)',
                transition: hover ? 'all 0.3s ease' : 'background-color 0.3s ease, border-color 0.3s ease'
            }}
            onMouseEnter={hover ? (e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            } : undefined}
            onMouseLeave={hover ? (e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            } : undefined}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--color-border-light)'
            }}
        >
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                    {title}
                </h3>
                {subtitle && (
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: number;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
    const colorMap = {
        blue: { bg: 'linear-gradient(135deg, #e6f2fa 0%, #cce5f5 100%)', iconBg: '#0073bb', iconColor: 'white' },
        green: { bg: 'linear-gradient(135deg, #e6f4ea 0%, #c8e6d0 100%)', iconBg: '#1a7f37', iconColor: 'white' },
        yellow: { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', iconBg: '#b45309', iconColor: 'white' },
        red: { bg: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)', iconBg: '#d13212', iconColor: 'white' },
        purple: { bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', iconBg: '#7c3aed', iconColor: 'white' },
    };

    const colors = colorMap[color];

    const TrendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend === undefined ? '' : trend > 0 ? '#1a7f37' : trend < 0 ? '#d13212' : 'var(--color-text-muted)';

    return (
        <div
            style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', margin: 0 }}>
                        {title}
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: '8px 0' }}>
                        {value}
                    </p>
                    {trend !== undefined && TrendIcon && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendIcon style={{ width: '16px', height: '16px', color: trendColor }} />
                            <span style={{ fontSize: '14px', color: trendColor }}>
                                {Math.abs(trend)}%
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>vs last week</span>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: colors.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.iconColor
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
