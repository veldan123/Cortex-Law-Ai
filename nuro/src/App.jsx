import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/Toast';

import Landing from './pages/marketing/Landing';
import Docs from './pages/marketing/Docs';
import Status from './pages/marketing/Status';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Automations from './pages/dashboard/Automations';
import Templates from './pages/dashboard/Templates';
import Logs from './pages/dashboard/Logs';
import ApiKeys from './pages/dashboard/ApiKeys';
import Usage from './pages/dashboard/Usage';
import Webhooks from './pages/dashboard/Webhooks';
import Billing from './pages/dashboard/Billing';
import Referrals from './pages/dashboard/Referrals';
import Settings from './pages/dashboard/Settings';
import Audit from './pages/dashboard/Audit';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function OnboardingGate({ children }) {
  const { user, onboarded } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/status" element={<Status />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<OnboardingGate><DashboardLayout /></OnboardingGate>}>
                <Route index element={<Overview />} />
                <Route path="automations" element={<Automations />} />
                <Route path="templates" element={<Templates />} />
                <Route path="logs" element={<Logs />} />
                <Route path="api-keys" element={<ApiKeys />} />
                <Route path="usage" element={<Usage />} />
                <Route path="webhooks" element={<Webhooks />} />
                <Route path="billing" element={<Billing />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="settings" element={<Settings />} />
                <Route path="audit" element={<Audit />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
