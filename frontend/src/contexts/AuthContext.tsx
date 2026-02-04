import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isBackendConnected: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkBackendConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBackendConnected, setIsBackendConnected] = useState(false);

    const checkBackendConnection = async (): Promise<boolean> => {
        const connected = await api.isBackendAvailable();
        setIsBackendConnected(connected);
        return connected;
    };

    useEffect(() => {
        // Check for existing auth on mount
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);

        // Check backend connection
        checkBackendConnection();
    }, []);

    const login = async (email: string, password: string) => {
        // First check if backend is available
        const backendAvailable = await checkBackendConnection();

        if (backendAvailable) {
            try {
                const response = await api.auth.login(email, password);

                const userData: User = {
                    id: 'user-1',
                    email: response.email,
                    name: response.name,
                    role: response.role,
                };

                setUser(userData);
                setToken(response.token);

                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ Logged in via backend API');
                return;
            } catch (error) {
                console.warn('⚠️ Backend login failed, using demo mode:', error);
            }
        }

        // Demo mode fallback
        console.log('📋 Using demo mode (backend not available)');
        const mockUser: User = {
            id: 'demo-user',
            email: email,
            name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: email.includes('admin') ? 'ADMIN' :
                email.includes('doctor') ? 'DOCTOR' :
                    email.includes('nurse') ? 'NURSE' : 'STAFF',
        };

        const mockToken = 'demo-token-' + Date.now();

        setUser(mockUser);
        setToken(mockToken);

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                isBackendConnected,
                login,
                logout,
                checkBackendConnection,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
