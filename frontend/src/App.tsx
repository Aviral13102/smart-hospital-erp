import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './modules/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { OpdDashboard } from './modules/opd/OpdDashboard';
import { IcuDashboard } from './modules/icu/IcuDashboard';
import { TransportDashboard } from './modules/transport/TransportDashboard';
import { NursingDashboard } from './modules/nursing/NursingDashboard';
import { LabDashboard } from './modules/lab/LabDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/opd" element={<OpdDashboard />} />
            <Route path="/icu" element={<IcuDashboard />} />
            <Route path="/transport" element={<TransportDashboard />} />
            <Route path="/nursing" element={<NursingDashboard />} />
            <Route path="/lab" element={<LabDashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
