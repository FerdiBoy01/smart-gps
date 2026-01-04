import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Smartphone, LogOut, Menu, X, MapPin } from 'lucide-react';
import { logoutUser } from '../services/authService';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Menu Item Helper
    const MenuItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800'
            }`}>
                <Icon size={20} />
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* SIDEBAR */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
                        <div className="flex items-center space-x-2 font-bold text-xl">
                            <MapPin className="text-blue-500" />
                            <span>Smart GPS</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <MenuItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <MenuItem to="/admin/users" icon={Users} label="Kelola User" />
                        <MenuItem to="/admin/devices" icon={Smartphone} label="Kelola Device" />
                        {/* Tambah menu lain di sini nanti */}
                    </nav>
                    
                    {/* Logout Button */}
                    <div className="p-4 border-t border-slate-800">
                        <button onClick={handleLogout} className="flex items-center w-full space-x-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                            <LogOut size={20} />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Mobile */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-slate-800">Admin Panel</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
                    <Outlet /> {/* Ini tempat halaman (UsersPage, dll) muncul */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;