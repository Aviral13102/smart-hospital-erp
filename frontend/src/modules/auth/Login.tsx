import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, Mail, Lock, Sun, Moon, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch {
      setError('Invalid credentials. Use admin@hospital.com / demo123');
    }
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
        {/* Decorative Pattern */}
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
            Operations & Facility ERP
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            Streamline your healthcare operations
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px',
          position: 'relative'
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

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', margin: '0 0 32px' }}>
            Sign in to your account
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

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'var(--color-text-muted)'
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hospital.com"
                  style={{
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
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'var(--color-text-muted)'
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
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
                  {showPassword ?
                    <EyeOff style={{ width: '20px', height: '20px' }} /> :
                    <Eye style={{ width: '20px', height: '20px' }} />
                  }
                </button>
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Hint */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-info-bg)',
              border: '1px solid var(--color-info)'
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--color-info)', margin: 0 }}>
              <strong>Demo:</strong> Use <code style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px' }}>admin@hospital.com</code> / <code style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px' }}>demo123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
