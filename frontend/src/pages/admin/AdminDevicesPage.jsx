import useAdminDevices from '../../hooks/useAdminDevices';
import { Smartphone, Plus, RotateCcw, User, Tag, X } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminDevicesPage = () => {
    const { 
        devices, loading, alert, isModalOpen, deviceIdInput,
        setDeviceIdInput, setModalOpen, setAlert,
        handleCreate, handleReset 
    } = useAdminDevices();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Inventaris Perangkat GPS</h1>
                    <p className="text-slate-500 text-sm">Buat dan kelola kode pairing alat GPS</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm">
                    <Plus size={18} /> Generate Device
                </button>
            </div>

            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">Device ID</th>
                            <th className="p-4">Pairing Code</th>
                            <th className="p-4">Pemilik (User)</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? <tr><td colSpan="5" className="p-4 text-center">Memuat data...</td></tr> : devices.map(dev => (
                            <tr key={dev.id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono font-bold text-slate-700">{dev.deviceId}</td>
                                <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono font-bold tracking-wider">{dev.pairingCode}</span></td>
                                <td className="p-4">
                                    {dev.owner ? ( // Ganti .User jadi .owner
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <User size={14}/> <span className="font-medium">{dev.owner.username}</span> {/* Ganti .User jadi .owner */}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Belum dipairing</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${dev.userId ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {dev.userId ? 'Paired' : 'Unpaired'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleReset(dev.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Reset Pairing">
                                        <RotateCcw size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && devices.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada device dibuat.</div>}
            </div>

            {/* MODAL CREATE DEVICE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Buat Device Baru</h3><button onClick={() => setModalOpen(false)}><X/></button></div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Device ID (Unik)</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-2.5 text-slate-400 w-5 h-5"/>
                                    <input value={deviceIdInput} onChange={e => setDeviceIdInput(e.target.value)} placeholder="Contoh: GPS-001" className="w-full pl-10 p-2 border rounded-lg uppercase" required />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">*Pairing Code akan digenerate otomatis</p>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Buat Sekarang</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDevicesPage;