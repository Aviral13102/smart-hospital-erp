import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, Building, Briefcase, Sun, Moon, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../lib/api';

export function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'STAFF',
        department: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await api.auth.signup({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
                department: formData.department || 'General'
            });
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        paddingLeft: '48px',
        paddingRight: '16px',
        paddingTop: '14px',
        paddingBottom: '14px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        fontSize: '16px',
        boxSizing: 'border-box' as const,
        outline: 'none'
    };

    const iconStyle = {
        position: 'absolute' as const,
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '20px',
        height: '20px',
        color: 'var(--color-text-muted)'
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                backgroundColor: 'var(--color-bg)',
                transition: 'background-color 0.3s ease'
            }}
        >
            {/* Left Panel - Branding */}
            <div
                style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #232f3e 0%, #0073bb 50%, #00a1c9 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '48px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        background: `radial-gradient(circle at 20% 80%, white 0%, transparent 25%), 
                        radial-gradient(circle at 80% 20%, white 0%, transparent 25%)`
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div
                        style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '24px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Activity style={{ width: '48px', height: '48px', color: 'white' }} />
                    </div>
                    <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', margin: '0 0 16px' }}>
                        Smart Hospital
                    </h1>
                    <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px' }}>
                        Join Our Team
                    </p>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                        Create your staff account to access the system
                    </p>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '48px',
                    position: 'relative',
                    overflowY: 'auto'
                }}
            >
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer'
                    }}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
                </button>

                <div style={{ width: '100%', maxWidth: '450px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
                        Create Account
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', margin: '0 0 32px' }}>
                        Register as a new staff member
                    </p>

                    {error && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 16px',
                                marginBottom: '24px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--color-error-bg)',
                                color: 'var(--color-error)'
                            }}
                        >
                            <AlertCircle style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px' }}>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 16px',
                                marginBottom: '24px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--color-success-bg)',
                                color: 'var(--color-success)'
                            }}
                        >
                            <CheckCircle style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px' }}>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                    First Name *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User style={iconStyle} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                    Last Name *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User style={iconStyle} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                Email *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={iconStyle} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john.doe@hospital.com"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        {/* Role and Department */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                    Role *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Briefcase style={iconStyle} />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, appearance: 'none' }}
                                        required
                                    >
                                        <option value="STAFF">Staff</option>
                                        <option value="DOCTOR">Doctor</option>
                                        <option value="NURSE">Nurse</option>
                                        <option value="LAB_TECH">Lab Technician</option>
                                        <option value="TRANSPORT">Transport</option>
                                        <option value="PHARMACIST">Pharmacist</option>
                                        <option value="RECEPTIONIST">Receptionist</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                    Department
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Building style={iconStyle} />
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, appearance: 'none' }}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="General Medicine">General Medicine</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Oncology">Oncology</option>
                                        <option value="Emergency">Emergency</option>
                                        <option value="ICU">ICU</option>
                                        <option value="Laboratory">Laboratory</option>
                                        <option value="Pharmacy">Pharmacy</option>
                                        <option value="Administration">Administration</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                Password *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={iconStyle} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{ ...inputStyle, paddingRight: '48px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                Confirm Password *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={iconStyle} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0073bb 0%, #00a1c9 100%)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: 'var(--color-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
