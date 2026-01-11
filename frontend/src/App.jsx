import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Components
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';

// Landing Page (BARU)
import LandingPage from './pages/LandingPage';
import AdminContentPage from './pages/admin/AdminContentPage';

// Admin Pages
import UsersPage from './pages/admin/UsersPage';
import AdminDevicesPage from './pages/admin/AdminDevicesPage';
import AdminDashboardPage from './pages/admin/DashboardPage'; // Halaman Real Dashboard
import ReportPage from './pages/user/ReportPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAlertsPage from './pages/admin/AdminAlertsPage';
import AdminProductPage from './pages/admin/AdminProductPage';

// User Pages
import MyDevicesPage from './pages/user/MyDevicesPage';
import DeviceDetailPage from './pages/user/DeviceDetailPage';
import SettingsPage from './pages/user/SettingsPage';
import GuidePage from './pages/user/GuidePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* ==============================
            PUBLIC ROUTES (Login/Register)
           ============================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* ==============================
            USER ROUTES (Protected by Logic inside Page or Component)
           ============================== */}
        <Route path="/dashboard" element={<MyDevicesPage />} />
        <Route path="/device/:id" element={<DeviceDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/guide" element={<GuidePage />} />

        {/* ==============================
            ADMIN ROUTES (Protected by AdminRoute)
           ============================== */}
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                {/* Redirect /admin ke /admin/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />
                
                <Route path="products" element={<AdminProductPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="devices" element={<AdminDevicesPage />} />
                <Route path="alerts" element={<AdminAlertsPage />} />
                <Route path="content" element={<AdminContentPage />} />
            </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;