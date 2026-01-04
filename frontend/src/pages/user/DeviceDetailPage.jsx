import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeviceDetail, getDeviceHistory } from '../../services/deviceService';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { ArrowLeft, Clock, Activity, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Icon Leaflet di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DeviceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Refresh data tiap 10 detik (Polling)
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchData = async () => {
        try {
            const devData = await getDeviceDetail(id);
            const histData = await getDeviceHistory(id);
            setDevice(devData);
            setHistory(histData);
            setLoading(false);
        } catch (error) {
            console.error("Gagal load data GPS", error);
        }
    };

    // Helper: Hitung Status Online (Jika update < 5 menit lalu)
    const isOnline = (lastActive) => {
        if (!lastActive) return false;
        const diff = new Date() - new Date(lastActive);
        return diff < 5 * 60 * 1000; // 5 menit
    };

    if (loading || !device) return <div className="p-10 text-center">Memuat Peta...</div>;

    const position = [device.lastLatitude || -6.200000, device.lastLongitude || 106.816666];
    const pathOptions = { color: 'blue' };
    const polyline = history.map(h => [h.latitude, h.longitude]);

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm z-10 flex justify-between items-center px-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">{device.name}</h1>
                        <p className="text-xs text-slate-500 font-mono">ID: {device.deviceId}</p>
                    </div>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className={`px-3 py-1 rounded-full font-bold flex items-center gap-2 ${isOnline(device.lastActive) ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                        <Activity size={16}/> {isOnline(device.lastActive) ? 'Online' : 'Offline'}
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        <Clock size={16}/> {device.lastActive ? new Date(device.lastActive).toLocaleTimeString() : '-'}
                    </div>
                </div>
            </div>

            {/* PETA */}
            <div className="flex-1 relative z-0">
                <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Marker Posisi Terakhir */}
                    {device.lastLatitude && (
                        <Marker position={position}>
                            <Popup>
                                <b>{device.name}</b><br />
                                Terakhir update: {new Date(device.lastActive).toLocaleString()}
                            </Popup>
                        </Marker>
                    )}

                    {/* Garis Jejak (History) */}
                    <Polyline pathOptions={pathOptions} positions={polyline} />
                </MapContainer>
            </div>
            
            {/* Floating Info Box */}
            <div className="absolute bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-80 bg-white p-4 rounded-xl shadow-xl z-[9999] border-l-4 border-blue-600">
                <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1" />
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Lokasi Terkini</p>
                        <p className="font-mono text-sm">{device.lastLatitude?.toFixed(6)}, {device.lastLongitude?.toFixed(6)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetailPage;