import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMyDevices from '../../hooks/useMyDevices';
import { getCurrentUser, logoutUser } from '../../services/authService';
import { 
    Plus, Smartphone, Trash2, X, MapPin, LogOut, 
    Activity, WifiOff, Clock, Signal, 
    Settings, MessageSquareWarning, BookOpen, Hexagon, ArrowRight, Car
} from 'lucide-react';
import Alert from '../../components/Alert';

const MyDevicesPage = () => {
    const navigate = useNavigate();
    const user = getCurrentUser(); 
    
    const { 
        devices, isModalOpen, formData, alert, loading,
        setModalOpen, closeAlert, handleInputChange, handlePair, handleUnpair 
    } = useMyDevices();

    // Helper: Cek Status Online (Toleransi 5 Menit)
    const isOnline = (lastActive) => {
        if (!lastActive) return false;
        const diff = new Date() - new Date(lastActive);
        return diff < 5 * 60 * 1000; // 5 Menit
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            
            {/* --- 1. NAVBAR MODERN (STICKY) --- */}
            <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 transition-all">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <Hexagon className="absolute text-blue-600 w-8 h-8 rotate-12" fill="currentColor" />
                            <Hexagon className="absolute text-orange-500 w-5 h-5 -rotate-12" fill="currentColor" />
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <h1 className="font-bold text-lg text-slate-800 tracking-tight">SmartGPS</h1>
                            <p className="text-[10px] text-slate-500 font-medium">User Dashboard</p>
                        </div>
                    </div>

                    {/* Menu Kanan */}
                    <div className="flex items-center gap-1 sm:gap-4">
                        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-200">
                            <span className="text-sm text-slate-600">Halo, <b>{user?.username}</b></span>
                        </div>

                        {/* Tombol Navigasi Cepat */}
                        <button onClick={() => navigate('/guide')} title="Panduan" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <BookOpen size={20} />
                        </button>
                        <button onClick={() => navigate('/reports')} title="Bantuan" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <MessageSquareWarning size={20} />
                        </button>
                        <button onClick={() => navigate('/settings')} title="Pengaturan" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <Settings size={20} />
                        </button>
                        
                        {/* Logout */}
                        <button onClick={handleLogout} className="ml-2 flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                            <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- 2. CONTENT UTAMA --- */}
            <div className="container mx-auto px-4 pt-8 max-w-6xl">
                
                {/* --- HEADER SECTION (DIPERBAIKI) --- */}
                {/* Sekarang dibungkus dalam Card Putih agar lebih rapi */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600 hidden sm:block">
                            <Car size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Aset Kendaraan</h2>
                            <p className="text-slate-500 text-sm mt-0.5">
                                Pantau lokasi dan status <span className="font-bold text-slate-700">{devices.length} kendaraan</span> Anda secara real-time.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setModalOpen(true)} 
                        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm"
                    >
                        <Plus size={18} /> Tambah Device
                    </button>
                </div>

                {/* Alert Notification */}
                {alert && <div className="mb-6 animate-fade-in-down"><Alert type={alert.type} message={alert.message} onClose={closeAlert} /></div>}

                {/* --- 3. GRID DEVICE LIST --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1,2,3].map(i => (
                            <div key={i} className="h-48 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse p-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
                                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : devices.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-bold text-lg">Belum ada perangkat</h3>
                            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                                Mulai pantau kendaraan Anda dengan menambahkan ID Perangkat dan Kode Pairing yang ada pada alat GPS.
                            </p>
                            <button onClick={() => setModalOpen(true)} className="mt-6 text-blue-600 font-bold hover:underline text-sm">
                                + Tambah Perangkat Baru
                            </button>
                        </div>
                    ) : (
                        devices.map(dev => {
                            const online = isOnline(dev.lastActive);
                            return (
                                <div key={dev.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all group">
                                    {/* Card Header */}
                                    <div className="p-5 pb-0 flex justify-between items-start">
                                        <div className={`p-3 rounded-2xl ${online ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {online ? <Activity size={24} /> : <WifiOff size={24} />}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${
                                                online ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                {online ? 'Online' : 'Offline'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock size={10} /> 
                                                {dev.lastActive ? new Date(dev.lastActive).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 pt-3">
                                        <h3 className="font-bold text-lg text-slate-800 truncate" title={dev.name}>{dev.name || 'Tanpa Nama'}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200">
                                                {dev.deviceId}
                                            </span>
                                        </div>
                                        
                                        {/* Status Info Mini */}
                                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Signal size={14} className={online ? "text-blue-500" : "text-slate-300"} />
                                                <span>{online ? 'GPS Kuat' : 'No Signal'}</span>
                                            </div>
                                            <div className="w-px h-3 bg-slate-300"></div>
                                            <div>
                                                {dev.speed ? `${dev.speed} km/h` : '0 km/h'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer (Actions) */}
                                    <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                                        <button 
                                            onClick={() => navigate(`/device/${dev.id}`)}
                                            className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <MapPin size={16} /> Lacak Lokasi
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(confirm('Yakin ingin menghapus perangkat ini?')) handleUnpair(dev.id);
                                            }} 
                                            className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                                            title="Hapus Perangkat"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* --- 4. MODAL PAIRING --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl scale-100 transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">Tambah Device</h3>
                                <p className="text-xs text-slate-500">Masukkan identitas alat GPS Anda.</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handlePair} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Device ID</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none"><Smartphone size={18}/></div>
                                    <input 
                                        name="deviceId" 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm font-medium transition-all uppercase placeholder:normal-case" 
                                        placeholder="Contoh: GPS-001" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Pairing Code</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none"><Signal size={18}/></div>
                                    <input 
                                        name="pairingCode" 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm font-medium transition-all uppercase placeholder:normal-case" 
                                        placeholder="Kode Unik (di boks alat)" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Nama Kendaraan</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-slate-400 pointer-events-none"><MapPin size={18}/></div>
                                    <input 
                                        name="name" 
                                        onChange={handleInputChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all" 
                                        placeholder="Misal: Honda Jazz Hitam" 
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 mt-4 transition-all active:scale-95 flex items-center justify-center gap-2">
                                Hubungkan <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDevicesPage;