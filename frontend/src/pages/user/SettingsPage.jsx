import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, updateProfileAPI } from '../../services/authService'; // Import updateProfileAPI
import { getMyDevices } from '../../services/deviceService';
import { 
    User, Smartphone, Map as MapIcon, Bell, 
    History, Moon, Shield, Save, ChevronRight, 
    Loader2, LogOut
} from 'lucide-react';
import Alert from '../../components/Alert';

// Import Komponen Tab
import ProfileTab from '../../components/settings/ProfileTab';
import DevicesTab from '../../components/settings/DevicesTab';
import MapTab from '../../components/settings/MapTab';
import AlertsTab from '../../components/settings/AlertsTab';
import SecurityTab from '../../components/settings/SecurityTab';

const SettingsPage = () => {
    const navigate = useNavigate();
    
    // State UI
    const [activeTab, setActiveTab] = useState('profile');
    const [alertMsg, setAlertMsg] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // State Data
    const [profile, setProfile] = useState({ username: '', email: '', phone: '' });
    const [mapSettings, setMapSettings] = useState({ theme: 'standard', markerColor: 'blue', refreshRate: 10 });
    const [alertSettings, setAlertSettings] = useState({ lowQuotaThreshold: 100, offlineAlert: true, geofenceAlert: false });
    const [myDevices, setMyDevices] = useState([]);

    // --- 1. LOAD DATA SAAT MASUK HALAMAN ---
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setIsLoadingData(true);
        try {
            // A. Ambil Data User dari LocalStorage (Single Source of Truth)
            const user = getCurrentUser();
            if (user) {
                setProfile({
                    username: user.username || '',
                    email: user.email || '', // Email biasanya readonly
                    phone: user.phone || ''  // Pastikan field phone ada
                });
            }

            // B. Ambil Settingan Lokal
            const savedMap = localStorage.getItem('mapSettings');
            if (savedMap) setMapSettings(JSON.parse(savedMap));

            const savedAlert = localStorage.getItem('alertSettings');
            if (savedAlert) setAlertSettings(JSON.parse(savedAlert));

            // C. Ambil Device Real dari Database
            const devices = await getMyDevices();
            setMyDevices(devices);

        } catch (error) {
            console.error("Gagal load data:", error);
            // Jangan set alert error di sini agar user tidak panik saat awal buka
        } finally {
            setIsLoadingData(false);
        }
    };

    // --- 2. TOMBOL SIMPAN ---
    const handleSave = async () => {
        setIsSaving(true);
        setAlertMsg(null);

        try {
            // A. Simpan Profile ke Server
            await updateProfileAPI({
                username: profile.username,
                phone: profile.phone
            });

            // B. Simpan Settingan Tampilan ke Browser
            localStorage.setItem('mapSettings', JSON.stringify(mapSettings));
            localStorage.setItem('alertSettings', JSON.stringify(alertSettings));

            setAlertMsg({ type: 'success', message: 'Semua perubahan berhasil disimpan!' });
            
            // Refresh data profile di UI (opsional, untuk memastikan sinkron)
            const updatedUser = getCurrentUser();
            setProfile(prev => ({ ...prev, ...updatedUser }));

        } catch (error) {
            console.error(error);
            setAlertMsg({ type: 'error', message: 'Gagal menyimpan. Cek koneksi server.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setAlertMsg(null), 3000);
        }
    };

    const handleLogout = () => {
        if(confirm("Keluar dari aplikasi?")) {
            logoutUser();
            navigate('/login');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'devices', label: 'Perangkat', icon: Smartphone },
        { id: 'map', label: 'Peta', icon: MapIcon },
        { id: 'alerts', label: 'Notifikasi', icon: Bell },
        { id: 'history', label: 'Data', icon: History },
        { id: 'ui', label: 'Tampilan', icon: Moon },
        { id: 'security', label: 'Keamanan', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
             {/* Navbar */}
             <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 flex justify-between items-center transition-all">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                        <ChevronRight className="rotate-180 text-slate-500 group-hover:text-blue-600 w-6 h-6 transition-colors" />
                    </button>
                    <span className="font-bold text-lg text-slate-800 tracking-tight">Pengaturan</span>
                </div>
                
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span className="hidden sm:inline">{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
            </nav>

            <div className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
                {alertMsg && <div className="mb-6 animate-fade-in-down"><Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg(null)} /></div>}

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <Loader2 size={40} className="animate-spin mb-2 text-blue-500" />
                        <p>Memuat pengaturan...</p>
                    </div>
                ) : (
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-start">
                        
                        {/* Sidebar Menu (Sticky & Scrollable on Mobile) */}
                        <div className="col-span-12 md:col-span-3 sticky top-[72px] z-20 w-full bg-slate-50 md:bg-transparent pt-1 pb-3 md:py-0">
                            <div className="flex md:flex-col overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar md:space-y-1 mask-linear-fade">
                                {tabs.map(tab => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-full md:rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                                                isActive 
                                                ? 'bg-blue-600 text-white shadow-md border-blue-600 ring-2 ring-blue-100 ring-offset-1' 
                                                : 'bg-white md:bg-transparent text-slate-500 border-slate-200 md:border-transparent hover:bg-white hover:text-slate-700 hover:shadow-sm'
                                            }`}
                                        >
                                            <tab.icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} /> 
                                            {tab.label}
                                            {isActive && <ChevronRight size={16} className="ml-auto hidden md:block opacity-50" />}
                                        </button>
                                    );
                                })}
                                
                                <div className="hidden md:block my-4 border-t border-slate-200 mx-2"></div>
                                
                                <button onClick={handleLogout} className="hidden md:flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                                    <LogOut size={18} /> Keluar
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="col-span-12 md:col-span-9 w-full">
                            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[500px] relative">
                                
                                {/* 1. PROFILE */}
                                {activeTab === 'profile' && <ProfileTab profile={profile} setProfile={setProfile} />}
                                
                                {/* 2. DEVICES (Pass setMyDevices agar real-time update) */}
                                {activeTab === 'devices' && <DevicesTab devices={myDevices} setDevices={setMyDevices} />} 
                                
                                {/* 3. MAP */}
                                {activeTab === 'map' && <MapTab settings={mapSettings} setSettings={setMapSettings} />}
                                
                                {/* 4. ALERTS */}
                                {activeTab === 'alerts' && <AlertsTab settings={alertSettings} setSettings={setAlertSettings} />}
                                
                                {/* 5. SECURITY */}
                                {activeTab === 'security' && <SecurityTab onLogout={handleLogout} />}

                                {/* Placeholder */}
                                {activeTab === 'history' && (
                                    <div className="text-center py-20 text-slate-400">
                                        <History size={48} className="mx-auto mb-4 opacity-50"/>
                                        <p>Riwayat data belum tersedia.</p>
                                    </div>
                                )}
                                {activeTab === 'ui' && (
                                    <div className="text-center py-20 text-slate-400">
                                        <Moon size={48} className="mx-auto mb-4 opacity-50"/>
                                        <p>Tema gelap segera hadir.</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Logout Mobile */}
                            <div className="md:hidden mt-8">
                                <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-white border border-red-100 hover:bg-red-50 shadow-sm">
                                    <LogOut size={18} /> Logout Akun
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;