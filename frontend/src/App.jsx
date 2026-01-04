import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import UserDashboard from './pages/UserDashboard'; // Dashboard untuk User
import AdminDashboard from './pages/AdminDashboard'; // Dashboard untuk Admin

// Components
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* User Route (Nanti bisa kita proteksi juga dengan PrivateRoute) */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* Admin Route (Terproteksi) */}
        <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;