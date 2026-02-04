import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-bg)'
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--color-primary)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}
                ></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg)',
                transition: 'background-color 0.3s ease'
            }}
        >
            <Sidebar />
            <div
                style={{
                    marginLeft: '256px',
                    transition: 'margin-left 0.3s ease'
                }}
            >
                <Header title={title} subtitle={subtitle} />
                <main style={{ padding: '32px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
