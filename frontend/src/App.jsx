import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';

// Komponen Dashboard Sementara (Placeholder)
const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'))?.user;
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Dashboard Smart GPS</h1>
            <p>Halo, {user?.username} ({user?.email})</p>
            <p className="mt-2 text-gray-600">Peta akan muncul di sini nanti...</p>
            <button onClick={handleLogout} className="px-4 py-2 mt-4 text-white bg-red-500 rounded">Logout</button>
        </div>
    );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;