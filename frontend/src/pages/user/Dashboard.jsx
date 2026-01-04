import useDashboard from '../../hooks/useDashboard';
import { MapPin, LogOut } from 'lucide-react';

const UserDashboard = () => {
    const { user, handleLogout } = useDashboard();

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b">
                <div className="flex items-center gap-2 text-blue-600"><MapPin className="w-6 h-6" /><span className="font-bold text-xl">Smart GPS</span></div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 hidden sm:block">Halo, {user?.username}</span>
                    <button onClick={handleLogout} className="flex items-center text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm border border-transparent hover:border-red-200">
                        <LogOut className="w-4 h-4 mr-1" /> Keluar
                    </button>
                </div>
            </nav>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-800">Peta Monitoring</h2>
                    <p className="text-slate-500 mt-2">Area peta akan dimuat di sini...</p>
                </div>
            </div>
        </div>
    );
};
export default UserDashboard;