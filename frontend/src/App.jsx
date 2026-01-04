import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Components
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout'; // Layout baru

// Pages (Sesuaikan path baru)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import UserDashboard from './pages/user/Dashboard'; 
import UsersPage from './pages/admin/UsersPage'; // Page Admin baru

// Halaman Placeholder Dashboard Admin (untuk halaman awal admin)
const AdminDashboardHome = () => (
    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Selamat Datang, Admin!</h2>
        <p className="text-slate-500 mt-2">Pilih menu di sidebar untuk mengelola sistem.</p>
    </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (AUTH) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* USER ROUTES */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ADMIN ROUTES (Nested dalam Layout & AdminRoute) */}
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                {/* Redirect /admin ke /admin/dashboard */}
                <Route index element={<Navigate to="/admin/dashboard" />} />
                
                <Route path="dashboard" element={<AdminDashboardHome />} />
                <Route path="users" element={<UsersPage />} />
            </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;