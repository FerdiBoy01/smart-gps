import { useEffect, useState } from 'react';
import { 
    Users, Smartphone, Activity, AlertTriangle, 
    Wifi, WifiOff, RefreshCw, Server, ArrowUpRight 
} from 'lucide-react';
import { getAllDevices } from '../../services/deviceService';

// HAPUS IMPORT getAllUsers KARENA TIDAK ADA DI SERVICE
// import { getAllUsers } from '../../services/authService'; 

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0,
        criticalQuota: 0,
        recentAlerts: []
    });
    const [loading, setLoading] = useState(true);

    // --- LOGIC PERHITUNGAN DATA ---
    const calculateStats = (devices) => {
        const now = new Date();
        
        // 1. Hitung Status Device
        let online = 0;
        let critical = 0;
        let alerts = [];

        devices.forEach(dev => {
            // Cek Online (5 menit toleransi)
            const lastActive = dev.lastActive ? new Date(dev.lastActive) : null;
            const isOnline = lastActive && (now - lastActive) < 5 * 60 * 1000;
            
            if (isOnline) online++;

            // Cek Kuota (Logic: > 90% used)
            if (dev.dataLimitMB > 0) {
                const usedMB = dev.dataUsedKB / 1024;
                const percent = (usedMB / dev.dataLimitMB) * 100;
                if (percent > 90) {
                    critical++;
                    alerts.push({
                        id: dev.id,
                        type: 'quota',
                        message: `Kuota ${dev.name} menipis (${percent.toFixed(0)}%)`,
                        time: lastActive
                    });
                }
            }

            // Cek Device Mati Lama (> 24 Jam) -> Masuk Alert
            if (lastActive && (now - lastActive) > 24 * 60 * 60 * 1000) {
                alerts.push({
                    id: dev.id,
                    type: 'offline',
                    message: `${dev.name} offline lebih dari 24 jam`,
                    time: lastActive
                });
            }
        });

        // 2. Hitung User (Estimasi dari pemilik device)
        // Kita hitung ada berapa 'userId' unik di dalam daftar device
        // (Karena kita tidak punya API getAllUsers, ini cara paling aman)
        const uniqueUsers = new Set(devices.map(d => d.userId).filter(id => id));
        const activeUserCount = uniqueUsers.size;

        setStats({
            // Karena tidak bisa ambil semua user, kita samakan Total dengan Active
            totalUsers: activeUserCount, 
            activeUsers: activeUserCount,
            totalDevices: devices.length,
            onlineDevices: online,
            offlineDevices: devices.length - online,
            criticalQuota: critical,
            recentAlerts: alerts.sort((a,b) => b.time - a.time).slice(0, 5) // Ambil 5 alert terbaru
        });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // HANYA PANGGIL DEVICES SAJA
            const devices = await getAllDevices();
            calculateStats(devices);
        } catch (error) {
            console.error("Dashboard Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto refresh setiap 30 detik
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // --- RENDER HELPER ---
    const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
                <Icon size={60} />
            </div>
            <div className="relative z-10">
                <div className={`p-3 rounded-xl w-fit ${color} bg-opacity-10 mb-4`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-medium">
                    {subtext}
                </p>
            </div>
        </div>
    );

    if (loading) return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>)}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Monitoring</h1>
                    <p className="text-slate-500 text-sm">Ringkasan performa sistem secara real-time.</p>
                </div>
                <button 
                    onClick={fetchData} 
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm text-sm font-bold active:scale-95"
                >
                    <RefreshCw size={16} /> Refresh Data
                </button>
            </div>

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 1. Total Device */}
                <StatCard 
                    title="Total Device" 
                    value={stats.totalDevices} 
                    subtext={`${stats.onlineDevices} Online • ${stats.offlineDevices} Offline`}
                    icon={Smartphone}
                    color="text-blue-600"
                />
                
                {/* 2. System Health (Online Rate) */}
                <StatCard 
                    title="Kesehatan Sistem" 
                    value={`${stats.totalDevices > 0 ? ((stats.onlineDevices/stats.totalDevices)*100).toFixed(0) : 0}%`}
                    subtext="Persentase device online saat ini"
                    icon={Activity}
                    color="text-green-600"
                />

                {/* 3. Active Users (Estimasi) */}
                <StatCard 
                    title="User Aktif" 
                    value={stats.activeUsers} 
                    subtext="User yang memiliki device terhubung"
                    icon={Users}
                    color="text-purple-600"
                />

                {/* 4. Critical Issues */}
                <StatCard 
                    title="Perlu Perhatian" 
                    value={stats.criticalQuota + stats.recentAlerts.filter(a => a.type === 'offline').length}
                    subtext="Kuota habis atau device mati lama"
                    icon={AlertTriangle}
                    color="text-red-600"
                />
            </div>

            {/* BOTTOM SECTION: GRID 2 KOLOM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: STATUS DEVICE DETAIL (2/3 Lebar) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <Server size={20} className="text-slate-400"/> Status Konektivitas
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Progress Bar Online */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-600">Online ({stats.onlineDevices})</span>
                                <span className="text-green-600 font-bold">{stats.totalDevices > 0 ? ((stats.onlineDevices/stats.totalDevices)*100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.onlineDevices/stats.totalDevices)*100}%` }}></div>
                            </div>
                        </div>

                        {/* Progress Bar Offline */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-600">Offline ({stats.offlineDevices})</span>
                                <span className="text-slate-400 font-bold">{stats.totalDevices > 0 ? ((stats.offlineDevices/stats.totalDevices)*100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-slate-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.offlineDevices/stats.totalDevices)*100}%` }}></div>
                            </div>
                        </div>

                        {/* Progress Bar Kuota Kritis */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-600">Kuota Kritis ({stats.criticalQuota})</span>
                                <span className="text-red-500 font-bold">{stats.totalDevices > 0 ? ((stats.criticalQuota/stats.totalDevices)*100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.criticalQuota/stats.totalDevices)*100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                        <Activity className="text-blue-600 mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="font-bold text-blue-800 text-sm">Tips Admin</h4>
                            <p className="text-xs text-blue-600 mt-1">
                                Pastikan untuk menghubungi user yang devicenya offline lebih dari 24 jam. 
                                Cek juga device dengan kuota di bawah 10% untuk mencegah putus koneksi.
                            </p>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: LIVE ALERTS (1/3 Lebar) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-orange-500"/> Peringatan Terbaru
                    </h3>

                    <div className="space-y-4">
                        {stats.recentAlerts.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <Activity size={40} className="mx-auto mb-2 opacity-50 text-green-500"/>
                                <p className="text-sm">Sistem aman terkendali.</p>
                            </div>
                        ) : (
                            stats.recentAlerts.map((alert, idx) => (
                                <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0">
                                    <div className={`mt-1 p-1.5 rounded-full shrink-0 ${alert.type === 'quota' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {alert.type === 'quota' ? <WifiOff size={14}/> : <Activity size={14}/>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{alert.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            {alert.time ? new Date(alert.time).toLocaleString() : 'Baru saja'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {stats.recentAlerts.length > 0 && (
                        <button className="w-full mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">
                            Lihat Semua Device <ArrowUpRight size={12}/>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;