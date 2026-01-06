import { useState, useEffect } from 'react';
import { getAllDevices } from '../../services/deviceService';
import { 
    AlertTriangle, WifiOff, MapPin, Activity, CheckCircle, 
    Search, Smartphone, ExternalLink, ChevronLeft, ChevronRight, Phone 
} from 'lucide-react';

const AdminAlertsPage = () => {
    // State Data
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter & Search
    const [filter, setFilter] = useState('all'); // all, offline, quota, geofence
    const [searchTerm, setSearchTerm] = useState("");

    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Tampilkan 5 alert per halaman

    useEffect(() => {
        analyzeSystemHealth();
    }, []);

    const analyzeSystemHealth = async () => {
        setLoading(true);
        try {
            const devices = await getAllDevices();
            const generatedAlerts = [];
            const now = new Date();

            devices.forEach(dev => {
                // 1. CEK OFFLINE (> 24 Jam mati)
                // Logika: Jika lastActive ada, dan selisih waktu > 24 jam
                const lastActive = dev.lastActive ? new Date(dev.lastActive) : null;
                const isOfflineLong = lastActive && (now - lastActive) > 24 * 60 * 60 * 1000; 
                
                if (isOfflineLong) {
                    generatedAlerts.push({
                        id: `off-${dev.id}`,
                        deviceId: dev.id,
                        deviceName: dev.name,
                        owner: dev.owner?.username || 'Tanpa Pemilik',
                        ownerPhone: dev.owner?.phone, // Ambil No HP Asli
                        type: 'offline',
                        level: 'critical', // Merah
                        message: `Device tidak aktif sejak ${lastActive.toLocaleDateString()}`,
                        timestamp: lastActive
                    });
                }

                // 2. CEK KUOTA (Sisa < 10% atau Terpakai > 90%)
                if (dev.dataLimitMB > 0) {
                    const usedMB = dev.dataUsedKB / 1024;
                    const percentUsed = (usedMB / dev.dataLimitMB) * 100;
                    
                    if (percentUsed >= 90) {
                        generatedAlerts.push({
                            id: `quota-${dev.id}`,
                            deviceId: dev.id,
                            deviceName: dev.name,
                            owner: dev.owner?.username || 'Tanpa Pemilik',
                            ownerPhone: dev.owner?.phone, // Ambil No HP Asli
                            type: 'quota',
                            level: percentUsed >= 100 ? 'critical' : 'warning',
                            message: `Penggunaan kuota mencapai ${percentUsed.toFixed(0)}%`,
                            timestamp: now
                        });
                    }
                }

                // 3. CEK GEOFENCE
                if (dev.isOutOfGeofence) { 
                    generatedAlerts.push({
                        id: `geo-${dev.id}`,
                        deviceId: dev.id,
                        deviceName: dev.name,
                        owner: dev.owner?.username,
                        ownerPhone: dev.owner?.phone,
                        type: 'geofence',
                        level: 'warning',
                        message: 'Kendaraan keluar dari zona aman (Geofence)',
                        timestamp: now
                    });
                }
            });

            // Urutkan: Critical duluan, lalu Warning
            generatedAlerts.sort((a, b) => (a.level === 'critical' ? -1 : 1));
            setAlerts(generatedAlerts);

        } catch (error) {
            console.error("Gagal analisa:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC WHATSAPP REMINDER ---
    const sendReminder = (alert) => {
        if (!alert.ownerPhone) {
            alert("User ini belum mendaftarkan nomor WhatsApp.");
            return;
        }

        const text = `Halo kak ${alert.owner}, sistem kami mendeteksi masalah pada kendaraan *${alert.deviceName}*.\n\n` + 
                     `⚠️ *Isu: ${alert.type.toUpperCase()}*\n` +
                     `📝 *Detail: ${alert.message}*\n\n` +
                     `Mohon segera dicek. Terima kasih.`;
                     
        window.open(`https://wa.me/${alert.ownerPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    // 1. Filter Logic
    const filteredAlerts = alerts.filter(a => {
        const matchesType = filter === 'all' || a.type === filter;
        const matchesSearch = a.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              a.owner.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    // 2. Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAlerts = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const stats = {
        total: alerts.length,
        critical: alerts.filter(a => a.level === 'critical').length,
        warning: alerts.filter(a => a.level === 'warning').length
    };

    return (
        <div className="p-6 md:p-8 font-sans min-h-screen bg-slate-50">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <AlertTriangle className="text-red-600" /> Alert Center
                    </h1>
                    <p className="text-slate-500 text-sm">Pusat kendali masalah operasional secara real-time.</p>
                </div>
                
                <div className="flex gap-3">
                    <div className="bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                        {stats.critical} Critical
                    </div>
                    <div className="bg-orange-50 text-orange-700 border border-orange-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                        {stats.warning} Warning
                    </div>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['all', 'offline', 'quota', 'geofence'].map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                filter === f 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                            {f === 'all' ? 'Semua Masalah' : f}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Cari User / Device..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {/* ALERT LIST */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col justify-between">
                <div>
                    {loading ? (
                        <div className="p-10 text-center text-slate-400">Sedang memindai sistem...</div>
                    ) : currentAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <CheckCircle size={64} className="text-green-500 mb-4 opacity-20"/>
                            <h3 className="font-bold text-lg text-slate-600">Sistem Aman!</h3>
                            <p className="text-sm">Tidak ditemukan masalah pada kategori ini.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {currentAlerts.map((alert) => (
                                <div key={alert.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    {/* ICON */}
                                    <div className={`p-3 rounded-xl shrink-0 ${
                                        alert.type === 'offline' ? 'bg-slate-100 text-slate-600' :
                                        alert.type === 'quota' ? 'bg-red-100 text-red-600' :
                                        'bg-orange-100 text-orange-600'
                                    }`}>
                                        {alert.type === 'offline' && <WifiOff size={24}/>}
                                        {alert.type === 'quota' && <Activity size={24}/>}
                                        {alert.type === 'geofence' && <MapPin size={24}/>}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                alert.level === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                                            }`}>
                                                {alert.level}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                {alert.timestamp.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-base">
                                            {alert.message}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Smartphone size={12}/> {alert.deviceName}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>Pemilik: <b>{alert.owner}</b></span>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <button 
                                            onClick={() => sendReminder(alert)}
                                            disabled={!alert.ownerPhone}
                                            className="flex-1 md:flex-none bg-green-50 text-green-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                            title={alert.ownerPhone ? `Kirim ke ${alert.ownerPhone}` : "No HP tidak tersedia"}
                                        >
                                            <Phone size={12} /> WhatsApp
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                            <ExternalLink size={18}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PAGINATION FOOTER */}
                {filteredAlerts.length > 0 && (
                    <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                            Menampilkan <b>{indexOfFirstItem + 1}</b> - <b>{Math.min(indexOfLastItem, filteredAlerts.length)}</b> dari <b>{filteredAlerts.length}</b> masalah
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                            
                            {/* Simple Pagination Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold ${
                                        currentPage === i + 1 
                                        ? 'bg-slate-800 text-white' 
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">
                    *Halaman ini diperbarui otomatis saat dibuka.
                </p>
            </div>
        </div>
    );
};

export default AdminAlertsPage;