import { Bell, Search, User, Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
    const { user, isBackendConnected } = useAuth();
    const { toggleTheme, isDark } = useTheme();

    return (
        <header
            style={{
                borderBottom: '1px solid var(--color-border)',
                padding: '16px 32px',
                backgroundColor: 'var(--color-surface)',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Title */}
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Backend Status */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: isBackendConnected ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                            border: `1px solid ${isBackendConnected ? 'var(--color-success)' : 'var(--color-warning)'}`,
                        }}
                        title={isBackendConnected ? 'Connected to backend services' : 'Using demo mode (backend offline)'}
                    >
                        {isBackendConnected ? (
                            <Wifi style={{ width: '16px', height: '16px', color: 'var(--color-success)' }} />
                        ) : (
                            <WifiOff style={{ width: '16px', height: '16px', color: 'var(--color-warning)' }} />
                        )}
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: isBackendConnected ? 'var(--color-success)' : 'var(--color-warning)'
                        }}>
                            {isBackendConnected ? 'Live' : 'Demo'}
                        </span>
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative' }}>
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
                            placeholder="Search..."
                            style={{
                                width: '240px',
                                paddingLeft: '40px',
                                paddingRight: '16px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-secondary)',
                                color: 'var(--color-text-primary)',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? (
                            <Sun style={{ width: '20px', height: '20px', color: '#d97706' }} />
                        ) : (
                            <Moon style={{ width: '20px', height: '20px', color: '#0073bb' }} />
                        )}
                    </button>

                    {/* Notifications */}
                    <button
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}
                    >
                        <Bell style={{ width: '20px', height: '20px' }} />
                        <span
                            style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#d13212'
                            }}
                        ></span>
                    </button>

                    {/* User */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--color-bg-secondary)'
                        }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0073bb 0%, #00a1c9 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <User style={{ width: '20px', height: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
                                {user?.name || 'User'}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                                {user?.role || 'Staff'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
