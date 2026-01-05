import useMyDevices from '../../hooks/useMyDevices';
import { getCurrentUser, logoutUser } from '../../services/authService';
import { Plus, Smartphone, Trash2, X, MapPin, LogOut, Activity, WifiOff, AlertTriangle, Clock, Signal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';

const MyDevicesPage = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    
    const { 
        devices, isModalOpen, alert, loading,
        setModalOpen, closeAlert, handleInputChange, handlePair, handleUnpair 
    } = useMyDevices();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // --- LOGIC HELPER ---
    const isOnline = (lastActive) => {
        if (!lastActive) return false;
        return (new Date() - new Date(lastActive)) < 5 * 60 * 1000;
    };

    const isQuotaCritical = (dev) => {
        if (!dev.dataLimitMB || dev.dataLimitMB === 0) return false;
        const usedMB = dev.dataUsedKB / 1024;
        const percent = (usedMB / dev.dataLimitMB) * 100;
        return percent > 90;
    };

    const stats = {
        total: devices.length,
        online: devices.filter(d => isOnline(d.lastActive)).length,
        offline: devices.filter(d => !isOnline(d.lastActive)).length,
        quotaWarning: devices.filter(d => isQuotaCritical(d)).length
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* 1. STICKY NAVBAR MODERN */}
            <nav className="bg-white/80 backdrop-blur-md px-5 py-4 shadow-sm border-b sticky top-0 z-50 flex justify-between items-center transition-all">
                <div className="flex items-center gap-2 text-blue-600">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">PRATIA</span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100">
                    <LogOut className="w-5 h-5" />
                </button>
            </nav>

            <div className="container mx-auto px-4 pt-6 pb-20 max-w-lg md:max-w-4xl">
                
                {/* 2. STATISTIK COMPACT (GRID 2 KOLOM DI MOBILE) */}
                {!loading && devices.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                        {/* Online */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Activity size={40} className="text-green-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.online} <span className="text-xs font-medium text-slate-400">Unit</span></p>
                            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.online/stats.total)*100}%` }}></div>
                            </div>
                        </div>

                        {/* Offline */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <WifiOff size={40} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offline</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.offline} <span className="text-xs font-medium text-slate-400">Unit</span></p>
                             <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(stats.offline/stats.total)*100}%` }}></div>
                            </div>
                        </div>

                        {/* Quota Alert (Span Full Width di Mobile jika ada warning, atau Grid biasa) */}
                        <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden col-span-2 md:col-span-1 ${stats.quotaWarning > 0 ? 'ring-2 ring-red-100' : ''}`}>
                            <div className="absolute right-0 top-0 p-3 opacity-10">
                                <AlertTriangle size={40} className={stats.quotaWarning > 0 ? "text-red-500" : "text-blue-500"} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kuota Kritis</p>
                            <p className={`text-2xl font-bold mt-1 ${stats.quotaWarning > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                                {stats.quotaWarning} <span className="text-xs font-medium text-slate-400">Device</span>
                            </p>
                             <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${stats.quotaWarning > 0 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: stats.quotaWarning > 0 ? '100%' : '0%' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. JUDUL & TOMBOL TAMBAH (SEJAJAR) */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Perangkat Saya</h2>
                        <p className="text-xs text-slate-500">Total {stats.total} kendaraan terdaftar</p>
                    </div>
                    <button 
                        onClick={() => setModalOpen(true)} 
                        className="bg-blue-600 text-white pl-3 pr-4 py-2 rounded-xl flex items-center gap-1 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-xs font-bold"
                    >
                        <Plus size={16} /> Tambah
                    </button>
                </div>

                {alert && <div className="mb-4"><Alert type={alert.type} message={alert.message} onClose={closeAlert} /></div>}

                {/* 4. LIST DEVICE YANG LEBIH CLEAN */}
                <div className="space-y-3">
                    {loading ? (
                        [1,2].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>)
                    ) : devices.map(dev => (
                        <div 
                            key={dev.id} 
                            onClick={() => navigate(`/device/${dev.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-slate-100 active:scale-[0.98] transition-all relative overflow-hidden cursor-pointer group"
                        >
                            {/* Status Bar Kiri */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isOnline(dev.lastActive) ? 'bg-green-500' : 'bg-slate-300'}`}></div>

                            <div className="flex items-center gap-4 pl-2">
                                {/* Icon Device */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isOnline(dev.lastActive) ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Smartphone size={24} strokeWidth={1.5} />
                                </div>

                                {/* Info Device */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800 text-base truncate pr-2">{dev.name}</h3>
                                        {/* Status Badge Kecil */}
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOnline(dev.lastActive) ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {isOnline(dev.lastActive) ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">ID: {dev.deviceId}</p>
                                    
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                            <Clock size={10}/> 
                                            {dev.lastActive ? new Date(dev.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                        </div>
                                        {isQuotaCritical(dev) && (
                                            <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold animate-pulse">
                                                <AlertTriangle size={10}/> Cek Kuota
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tombol Hapus (Hidden by default, show on hover/swipe logic ideally, but simplified here) */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleUnpair(dev.id); }} 
                                className="absolute top-0 right-0 p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && devices.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Signal size={32} />
                        </div>
                        <h3 className="text-slate-600 font-bold">Belum ada perangkat</h3>
                        <p className="text-xs text-slate-400 mt-1">Tambahkan GPS Tracker Anda sekarang.</p>
                    </div>
                )}
            </div>

            {/* MODAL PAIRING (Desain diperhalus) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-[60] p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">Tambah Device</h3>
                                <p className="text-xs text-slate-400 mt-1">Masukkan ID dan Kode dari alat GPS</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><X size={18}/></button>
                        </div>
                        <form onSubmit={handlePair} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 ml-1">DEVICE ID</label>
                                <input name="deviceId" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm" placeholder="Contoh: GPS-001" required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 ml-1">PAIRING CODE</label>
                                <input name="pairingCode" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm" placeholder="Contoh: 123456" required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 ml-1">NAMA KENDARAAN</label>
                                <input name="name" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" placeholder="Misal: Honda Beat" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 mt-2 active:scale-95 transition-transform">
                                Hubungkan
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDevicesPage;