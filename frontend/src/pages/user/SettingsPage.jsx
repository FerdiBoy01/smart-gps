import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, updateProfileAPI } from '../../services/authService';
import { getMyDevices } from '../../services/deviceService';
import { 
    User, Smartphone, Map as MapIcon, Bell, 
    Shield, Save, Loader2, LogOut, ArrowLeft
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

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setIsLoadingData(true);
        try {
            // A. User
            const user = getCurrentUser();
            if (user) {
                setProfile({
                    username: user.username || '',
                    email: user.email || '',
                    phone: user.phone || ''
                });
            }

            // B. Local Settings
            const savedMap = localStorage.getItem('mapSettings');
            if (savedMap) setMapSettings(JSON.parse(savedMap));

            const savedAlert = localStorage.getItem('alertSettings');
            if (savedAlert) setAlertSettings(JSON.parse(savedAlert));

            // C. Devices
            const devices = await getMyDevices();
            setMyDevices(devices);

        } catch (error) {
            console.error("Gagal load data:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setAlertMsg(null);

        try {
            await updateProfileAPI({
                username: profile.username,
                phone: profile.phone
            });

            localStorage.setItem('mapSettings', JSON.stringify(mapSettings));
            localStorage.setItem('alertSettings', JSON.stringify(alertSettings));

            setAlertMsg({ type: 'success', message: 'Pengaturan berhasil disimpan!' });
            
            const updatedUser = getCurrentUser();
            setProfile(prev => ({ ...prev, ...updatedUser }));

        } catch (error) {
            setAlertMsg({ type: 'error', message: 'Gagal menyimpan. Cek koneksi internet.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setAlertMsg(null), 3000);
        }
    };

    const handleLogout = () => {
        if(confirm("Yakin ingin keluar akun?")) {
            logoutUser();
            navigate('/');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Akun Saya', icon: User },
        { id: 'devices', label: 'Perangkat', icon: Smartphone },
        { id: 'map', label: 'Peta', icon: MapIcon },
        { id: 'alerts', label: 'Notifikasi', icon: Bell },
        { id: 'security', label: 'Keamanan', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
             
             {/* --- NAVBAR --- */}
             <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 transition-all">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors group text-slate-500 hover:text-blue-600"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="font-bold text-lg text-slate-800 tracking-tight">Pengaturan</h1>
                            <p className="text-[10px] text-slate-500 font-medium">Konfigurasi Aplikasi</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span className="hidden sm:inline">{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                    </button>
                </div>
            </nav>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                
                {alertMsg && (
                    <div className="mb-6 animate-fade-in-down">
                        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg(null)} />
                    </div>
                )}

                {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
                        <p className="text-sm font-medium">Memuat konfigurasi...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        
                        {/* --- SIDEBAR MENU (FIXED MOBILE) --- */}
                        <div className="col-span-12 md:col-span-3 lg:col-span-3 sticky md:top-24 z-20">
                            {/* Hapus overflow-hidden di sini agar scroll horizontal mobile tidak terpotong */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
                                {/* Tambahkan style scrollbarWidth: none untuk menyembunyikan scrollbar native */}
                                <div 
                                    className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1 pb-1 md:pb-0"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {tabs.map(tab => {
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap text-left ${
                                                    isActive 
                                                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                                }`}
                                            >
                                                <tab.icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} /> 
                                                <span className="flex-1">{tab.label}</span>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 hidden md:block"></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <div className="hidden md:block my-2 border-t border-slate-100 mx-2"></div>
                                
                                <button onClick={handleLogout} className="hidden md:flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
                                    <LogOut size={18} /> Keluar Akun
                                </button>
                            </div>
                        </div>

                        {/* --- CONTENT AREA --- */}
                        <div className="col-span-12 md:col-span-9 lg:col-span-9 w-full">
                            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] relative animate-fade-in">
                                
                                {/* Header Content */}
                                <div className="mb-6 border-b border-slate-100 pb-4 flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                                        {tabs.find(t => t.id === activeTab)?.icon && 
                                            (() => {
                                                const Icon = tabs.find(t => t.id === activeTab).icon;
                                                return <Icon size={24} />;
                                            })()
                                        }
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </h2>
                                </div>

                                {/* Content Body */}
                                <div className="space-y-6">
                                    {activeTab === 'profile' && <ProfileTab profile={profile} setProfile={setProfile} />}
                                    {activeTab === 'devices' && <DevicesTab devices={myDevices} setDevices={setMyDevices} />} 
                                    {activeTab === 'map' && <MapTab settings={mapSettings} setSettings={setMapSettings} />}
                                    {activeTab === 'alerts' && <AlertsTab settings={alertSettings} setSettings={setAlertSettings} />}
                                    {activeTab === 'security' && <SecurityTab onLogout={handleLogout} />}
                                </div>

                            </div>
                            
                            {/* Logout Mobile Only */}
                            <div className="md:hidden mt-6">
                                <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 bg-white border border-red-100 hover:bg-red-50 shadow-sm transition-all active:scale-95">
                                    <LogOut size={18} /> Keluar Akun
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