import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Components
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';

// Admin Pages
import UsersPage from './pages/admin/UsersPage';
import AdminDevicesPage from './pages/admin/AdminDevicesPage';

// User Pages
import MyDevicesPage from './pages/user/MyDevicesPage'; // Import Page Baru
import DeviceDetailPage from './pages/user/DeviceDetailPage';


// Placeholder Dashboard Admin
const AdminDashboardHome = () => (
    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Admin</h2>
        <p className="text-slate-500 mt-2">Selamat datang di panel kontrol Smart GPS.</p>
    </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* USER ROUTES */}
        {/* Menggunakan MyDevicesPage sebagai dashboard utama user */}
        <Route path="/dashboard" element={<MyDevicesPage />} />
        <Route path="/device/:id" element={<DeviceDetailPage />} />

        {/* ADMIN ROUTES (Protected) */}
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<AdminDashboardHome />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="devices" element={<AdminDevicesPage />} />
            </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;