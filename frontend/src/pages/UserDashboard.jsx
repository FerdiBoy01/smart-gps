import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService'; // Pakai fungsi dari service
import { MapPin, LogOut } from 'lucide-react';

const UserDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'))?.user;

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-200">
                <div className="flex items-center gap-2 text-blue-600">
                    <MapPin className="w-6 h-6" />
                    <span className="font-bold text-xl tracking-tight">Smart GPS</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 hidden sm:block">Halo, {user?.username}</span>
                    <button onClick={handleLogout} className="flex items-center text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent hover:border-red-200">
                        <LogOut className="w-4 h-4 mr-1" /> Keluar
                    </button>
                </div>
            </nav>

            {/* Content Placeholder */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-800">Peta Monitoring</h2>
                    <p className="text-slate-500 mt-2">Peta lokasi device kamu akan muncul di sini.</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;