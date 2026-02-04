import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BedDouble,
    Truck,
    UserCog,
    FlaskConical,
    ChevronLeft,
    ChevronRight,
    Activity,
    LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/opd', icon: Users, label: 'OPD Management' },
    { path: '/icu', icon: BedDouble, label: 'ICU & Beds' },
    { path: '/transport', icon: Truck, label: 'Transport' },
    { path: '/nursing', icon: UserCog, label: 'Nursing Roster' },
    { path: '/lab', icon: FlaskConical, label: 'Lab Samples' },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout, user } = useAuth();
    const location = useLocation();

    const sidebarWidth = collapsed ? '80px' : '256px';

    return (
        <aside
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                width: sidebarWidth,
                backgroundColor: '#232f3e',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 40,
                transition: 'width 0.3s ease',
                overflow: 'hidden'
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0073bb 0%, #00a1c9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <Activity style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                {!collapsed && (
                    <div>
                        <h1 style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', margin: 0 }}>Smart Hospital</h1>
                        <p style={{ fontSize: '12px', color: '#d5dbdb', margin: 0 }}>ERP System</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav
                style={{
                    flex: 1,
                    padding: '24px 12px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}
            >
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                backgroundColor: isActive ? '#0073bb' : 'transparent',
                                color: isActive ? '#ffffff' : '#d5dbdb',
                                boxShadow: isActive ? '0 4px 12px rgba(0, 115, 187, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = '#37475a';
                                    e.currentTarget.style.color = '#ffffff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#d5dbdb';
                                }
                            }}
                        >
                            <item.icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                            {!collapsed && <span style={{ fontWeight: 500 }}>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Section */}
            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {!collapsed && user && (
                    <div style={{ marginBottom: '12px', padding: '0 12px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                        <p style={{ fontSize: '12px', color: '#d5dbdb', margin: 0 }}>{user.role}</p>
                    </div>
                )}
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        color: '#d5dbdb',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.2)';
                        e.currentTarget.style.color = '#f85149';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#d5dbdb';
                    }}
                >
                    <LogOut style={{ width: '20px', height: '20px' }} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '80px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#0073bb',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            >
                {collapsed ? <ChevronRight style={{ width: '16px', height: '16px' }} /> : <ChevronLeft style={{ width: '16px', height: '16px' }} />}
            </button>
        </aside>
    );
}

// Export sidebar width for use in layout
export const SIDEBAR_WIDTH = '256px';
export const SIDEBAR_COLLAPSED_WIDTH = '80px';
