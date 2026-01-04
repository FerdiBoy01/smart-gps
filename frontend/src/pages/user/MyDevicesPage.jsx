import useMyDevices from '../../hooks/useMyDevices';
import { getCurrentUser, logoutUser } from '../../services/authService';
import { Plus, Smartphone, Trash2, X, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';

const MyDevicesPage = () => {
    const navigate = useNavigate();
    const user = getCurrentUser(); // Ambil data user
    
    // Panggil Logic dari Hook
    const { 
        devices, isModalOpen, formData, alert, loading,
        setModalOpen, closeAlert, handleInputChange, handlePair, handleUnpair 
    } = useMyDevices();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar User */}
            <nav className="bg-white px-6 py-4 shadow-sm border-b mb-6 sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600">
                    <MapPin className="w-6 h-6" />
                    <span className="font-bold text-xl tracking-tight">Smart GPS</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 hidden sm:block">Halo, <b>{user?.username}</b></span>
                    <button onClick={handleLogout} className="flex items-center text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        <LogOut className="w-4 h-4 mr-1" /> Keluar
                    </button>
                </div>
            </nav>

            {/* Content Container */}
            <div className="container mx-auto px-4 pb-10 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Perangkat Saya</h1>
                        <p className="text-slate-500 mt-1">Daftar alat GPS yang terhubung ke akun ini.</p>
                    </div>
                    <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 font-medium">
                        <Plus size={20} /> Tambah Device
                    </button>
                </div>

                {/* Alert Notification */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}

                {/* Grid Device List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-slate-500 col-span-full text-center py-10 animate-pulse">Sedang memuat perangkat...</p>
                    ) : devices.map(dev => (
                        <div key={dev.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleUnpair(dev.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100" title="Hapus Device">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-4 rounded-2xl">
                                    <Smartphone className="text-blue-600 w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{dev.name}</h3>
                                    <p className="text-xs text-slate-400 font-mono mt-1 tracking-wide">ID: {dev.deviceId}</p>
                                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Empty State */}
                {!loading && devices.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <Smartphone className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-slate-700 font-bold text-lg">Belum ada perangkat</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mt-2 text-sm">Anda belum menghubungkan alat GPS apapun. Klik tombol Tambah Device di atas.</p>
                    </div>
                )}
            </div>

            {/* MODAL POPUP PAIRING */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-fade-in-down">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl text-slate-800">Pairing Device</h3>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handlePair} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Device ID</label>
                                <input name="deviceId" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none font-mono font-medium transition-all" placeholder="Contoh: GPS-001" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pairing Code</label>
                                <input name="pairingCode" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none font-mono font-medium transition-all" placeholder="Contoh: A1B2C3" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Kendaraan</label>
                                <input name="name" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all" placeholder="Misal: Honda Jazz" />
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 mt-2 transition-all active:scale-95">
                                Hubungkan Sekarang
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDevicesPage;