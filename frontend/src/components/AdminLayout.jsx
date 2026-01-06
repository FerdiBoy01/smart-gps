import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { 
    LayoutDashboard, Users, Smartphone, 
    MessageSquareWarning, LogOut, MapPin, AlertTriangle
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const navItems = [
        { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: 'users', label: 'Manajemen User', icon: Users },
        { path: 'devices', label: 'Manajemen Device', icon: Smartphone },
        { path: 'reports', label: 'Laporan User', icon: MessageSquareWarning }, // Menu Baru
        { path: 'alerts', label: 'Alert Center', icon: AlertTriangle },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col z-20">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2 text-blue-600">
                    <MapPin className="w-6 h-6" />
                    <span className="font-bold text-xl tracking-tight text-slate-800">Admin Panel</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={`/admin/${item.path}`}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                ${isActive 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} /> Keluar
                    </button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 md:ml-64 p-0 md:p-0 overflow-x-hidden">
                {/* Mobile Header (Hanya muncul di layar kecil) */}
                <div className="md:hidden bg-white p-4 shadow-sm border-b flex justify-between items-center sticky top-0 z-30">
                    <span className="font-bold text-slate-800">Admin Panel</span>
                    <button onClick={handleLogout} className="text-slate-400"><LogOut/></button>
                </div>
                
                <Outlet />
            </main>

            {/* Mobile Bottom Nav (Optional, untuk layar kecil) */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-40">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={`/admin/${item.path}`}
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold
                            ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}
                        `}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminLayout;