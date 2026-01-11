import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeviceDetail, getDeviceHistory } from '../../services/deviceService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { 
    ArrowLeft, Clock, MapPin, Signal, Calendar, Search, RefreshCw, 
    Power, AlertTriangle, Loader2 // <--- IMPORT ICON BARU
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- CONFIG ICON LEAFLET (JANGAN DIHAPUS) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const StartIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const EndIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPONENT: AUTO ZOOM ---
const FitBounds = ({ path }) => {
    const map = useMap();
    useEffect(() => {
        if (path.length > 0) {
            const bounds = L.latLngBounds(path);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [path, map]);
    return null;
};

const DeviceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State Data
    const [device, setDevice] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState("");
    
    // State Modal Cut Engine
    const [isCutModalOpen, setIsCutModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Polling Logic
    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(() => {
            if (!filterDate) fetchInitialData(); 
        }, 10000); 
        return () => clearInterval(interval);
    }, [id, filterDate]);

    const fetchInitialData = async () => {
        try {
            const devData = await getDeviceDetail(id);
            if (!filterDate) {
                const histData = await getDeviceHistory(id);
                setHistory(histData);
            }
            setDevice(devData);
            setLoading(false);
        } catch (error) {
            console.error("Gagal load data GPS", error);
        }
    };

    // Filter Logic
    const handleFilterSearch = async (e) => {
        e.preventDefault();
        if (!filterDate) return;
        setLoading(true);
        try {
            const start = `${filterDate}T00:00:00`;
            const end = `${filterDate}T23:59:59`;
            const histData = await getDeviceHistory(id, start, end);
            setHistory(histData);
            if(histData.length === 0) alert("Tidak ada data perjalanan pada tanggal ini.");
        } catch (error) {
            console.error(error);
            alert("Gagal memuat history");
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilter = () => {
        setFilterDate("");
        setLoading(true);
        fetchInitialData();
    };

    // --- LOGIC MATIKAN MESIN (SIMULASI) ---
    const executeCutEngine = () => {
        setActionLoading(true);
        // Simulasi request ke backend
        setTimeout(() => {
            setActionLoading(false);
            setIsCutModalOpen(false);
            alert(`PERINTAH TERKIRIM: Mesin ${device.name} dimatikan.`);
        }, 2000);
    };

    // Helper UI
    const isOnline = (lastActive) => {
        if (!lastActive) return false;
        return (new Date() - new Date(lastActive)) < 5 * 60 * 1000;
    };

    const getQuotaStatus = (usedKB, limitMB) => {
        if (!limitMB || limitMB === 0) return { percent: 0, color: 'bg-slate-200', text: 'No Data' };
        const usedMB = usedKB / 1024;
        const percent = Math.min((usedMB / limitMB) * 100, 100);
        let color = 'bg-green-500';
        let status = 'Aman';
        if (percent > 90) { color = 'bg-red-500'; status = 'Kritis'; }
        else if (percent > 75) { color = 'bg-yellow-500'; status = 'Menipis'; }
        return { percent, color, status, usedMB };
    };

    if (loading && !device) return (
        <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium">
            <div className="flex flex-col items-center gap-2">
                <RefreshCw className="animate-spin text-blue-500" />
                <span>Memuat Peta...</span>
            </div>
        </div>
    );

    const currentPos = [device.lastLatitude || -6.200000, device.lastLongitude || 106.816666];
    const polyline = history.map(h => [h.latitude, h.longitude]);
    const quota = getQuotaStatus(device.dataUsedKB || 0, device.dataLimitMB || 0);
    const startPoint = history.length > 0 ? history[0] : null;
    const endPoint = history.length > 0 ? history[history.length - 1] : null;

    return (
        <div className="h-screen w-full relative bg-slate-100 overflow-hidden font-sans">
            
            {/* 1. FLOATING HEADER */}
            <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-3 border border-white/20 pointer-events-auto flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">{device.name}</h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{device.deviceId}</span>
                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${isOnline(device.lastActive) ? 'text-green-600' : 'text-slate-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline(device.lastActive) ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                        {isOnline(device.lastActive) ? 'Online' : 'Offline'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center justify-end gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                                <Clock size={12}/>
                                {device.lastActive ? new Date(device.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-1 rounded-xl flex items-center gap-2 border border-slate-100">
                        <div className="pl-3 text-slate-400"><Calendar size={16}/></div>
                        <input 
                            type="date" 
                            className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 w-full focus:outline-none py-1"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {filterDate ? (
                            <div className="flex gap-1 pr-1">
                                <button onClick={handleFilterSearch} className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                    <Search size={16}/>
                                </button>
                                <button onClick={handleResetFilter} className="bg-red-100 text-red-500 p-1.5 rounded-lg hover:bg-red-200 transition-colors">
                                    <RefreshCw size={16}/>
                                </button>
                            </div>
                        ) : (
                            <button className="bg-slate-200 text-slate-400 p-1.5 rounded-lg cursor-not-allowed pr-2">
                                <Search size={16}/>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. MAP CONTAINER */}
            <div className="h-full w-full relative z-0"> 
                <MapContainer center={currentPos} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline positions={polyline} pathOptions={{ color: filterDate ? '#8b5cf6' : '#2563eb', weight: 4, opacity: 0.8 }} />
                    <FitBounds path={polyline} />
                    {filterDate ? (
                        <>
                            {startPoint && <Marker position={[startPoint.latitude, startPoint.longitude]} icon={StartIcon}><Popup>Start</Popup></Marker>}
                            {endPoint && <Marker position={[endPoint.latitude, endPoint.longitude]} icon={EndIcon}><Popup>Finish</Popup></Marker>}
                        </>
                    ) : (
                        device.lastLatitude && (
                            <Marker position={currentPos}>
                                <Popup><b className="text-blue-600">{device.name}</b></Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
            </div>
            
            {/* 3. FLOATING INFO PANEL (Bottom) */}
            <div className="absolute bottom-6 left-4 right-4 z-[999] pointer-events-none">
                {/* Gunakan Grid 3 Kolom biar tombol muat */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
                    
                    {/* Card 1: Koordinat */}
                    <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/50 pointer-events-auto flex items-center gap-4">
                        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokasi</p>
                            <p className="font-mono text-sm font-bold text-slate-700 leading-tight mt-0.5">
                                {device.lastLatitude?.toFixed(5)}, {device.lastLongitude?.toFixed(5)}
                            </p>
                        </div>
                    </div>

                    {/* Card 2: SIM & Kuota */}
                    <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/50 pointer-events-auto flex items-center gap-4">
                        <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                            <Signal size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-slate-800 text-sm truncate">{device.simProvider || "No SIM"}</h3>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${quota.percent > 90 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {quota.status}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-full rounded-full ${quota.color}`} style={{ width: `${quota.percent}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* --- CARD 3: TOMBOL CUT ENGINE (DISINI!) --- */}
                    <button 
                        onClick={() => setIsCutModalOpen(true)}
                        className="bg-red-600/90 backdrop-blur hover:bg-red-700 p-4 rounded-2xl shadow-xl border border-red-500/50 pointer-events-auto flex items-center justify-center gap-3 text-white transition-all active:scale-95 group"
                    >
                        <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                            <Power size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-red-100 font-bold uppercase tracking-wider">Kontrol Mesin</p>
                            <p className="font-bold text-sm leading-tight">MATIKAN</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* --- MODAL SAFETY POPUP (Popup Muncul Disini) --- */}
            {isCutModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800">Matikan Mesin?</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Anda akan mematikan mesin <strong>{device.name}</strong>. 
                            <br/><span className="text-red-500 font-bold text-xs">Pastikan kendaraan dalam kondisi aman!</span>
                        </p>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={executeCutEngine}
                                disabled={actionLoading}
                                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <><Loader2 className="animate-spin" size={20}/> Mengirim...</> : "YA, MATIKAN SEKARANG"}
                            </button>
                            <button 
                                onClick={() => setIsCutModalOpen(false)}
                                disabled={actionLoading}
                                className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceDetailPage;