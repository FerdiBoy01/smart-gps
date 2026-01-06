import { useState } from 'react';
import useAdminDevices from '../../hooks/useAdminDevices';
import { 
    Smartphone, Plus, RotateCcw, Tag, X, Signal, CheckCircle, 
    Wifi, Search, AlertCircle 
} from 'lucide-react';
import Alert from '../../components/Alert';

const AdminDevicesPage = () => {
    const { 
        devices, loading, alert, isModalOpen, deviceIdInput,
        setDeviceIdInput, setModalOpen, setAlert,
        handleCreate, handleReset, handleUpdateSim
    } = useAdminDevices();

    // State untuk Modal SIM & Search
    const [simModal, setSimModal] = useState({ isOpen: false, deviceId: null, data: {} });
    const [searchTerm, setSearchTerm] = useState("");

    // Handler Submit Form SIM
    const onSimSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const payload = {
            simProvider: formData.get('simProvider'),
            simNumber: formData.get('simNumber'),
            dataLimitMB: formData.get('dataLimitMB'),
            resetUsage: formData.get('resetUsage') === 'on' 
        };

        handleUpdateSim(simModal.deviceId, payload);
        setSimModal({ isOpen: false, deviceId: null, data: {} });
    };

    // Filter Devices
    const filteredDevices = devices.filter(d => 
        d.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (d.owner?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 font-sans min-h-screen bg-slate-50">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Perangkat</h1>
                    <p className="text-slate-500 text-sm">Monitor status pairing dan kelola kartu SIM device.</p>
                </div>
                <button 
                    onClick={() => setModalOpen(true)} 
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                    <Plus size={18} /> Tambah Device
                </button>
            </div>

            {/* Alert Global */}
            {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

            {/* --- SEARCH BAR --- */}
            <div className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex items-center gap-3">
                <Search className="text-slate-400" size={20}/>
                <input 
                    type="text" 
                    placeholder="Cari berdasarkan Device ID atau Username..." 
                    className="flex-1 outline-none text-sm font-medium text-slate-700 placeholder:font-normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- TABEL DEVICES --- */}
            <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 w-1/6">Device ID</th>
                                <th className="p-5 w-1/6">Pairing Code</th>
                                <th className="p-5 w-1/4">Info SIM Card</th>
                                <th className="p-5 w-1/6">Pemilik</th>
                                <th className="p-5 text-center w-1/6">Status</th>
                                <th className="p-5 text-center w-1/6">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400 font-medium">Memuat data...</td></tr>
                            ) : filteredDevices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Smartphone size={48} className="mb-2 opacity-20"/>
                                            <p className="font-bold">Tidak ada data device</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDevices.map((dev, idx) => (
                                <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                                <Smartphone size={18}/>
                                            </div>
                                            <span className="font-mono font-bold text-slate-700">{dev.deviceId}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-md font-mono font-bold tracking-wider text-xs">
                                            {dev.pairingCode}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        {dev.simProvider ? (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1"><Wifi size={14} className="text-indigo-500"/></div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-xs">{dev.simProvider}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{dev.simNumber}</div>
                                                    <div className="mt-1 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-indigo-500 rounded-full" 
                                                            style={{ width: `${Math.min(((dev.dataUsedKB/1024)/dev.dataLimitMB)*100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs flex items-center gap-1">
                                                <AlertCircle size={12}/> Belum diset
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        {dev.owner ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                    {dev.owner.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-700 text-xs">{dev.owner.username}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Belum ada user</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center justify-center gap-1 w-fit mx-auto ${
                                            dev.userId 
                                            ? 'bg-green-50 text-green-600 border-green-200' 
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                            {dev.userId ? <CheckCircle size={10}/> : <X size={10}/>}
                                            {dev.userId ? 'Paired' : 'Unpaired'}
                                        </span>
                                    </td>
                                    
                                    {/* --- BAGIAN TOMBOL AKSI (DIUPDATE TANPA HOVER) --- */}
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => setSimModal({ isOpen: true, deviceId: dev.id, data: dev })} 
                                                className="bg-white border border-indigo-100 text-indigo-600 p-2 rounded-lg shadow-sm active:scale-95 transition-transform" 
                                                title="Setup SIM Card"
                                            >
                                                <Signal size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleReset(dev.id)} 
                                                className="bg-white border border-red-100 text-red-500 p-2 rounded-lg shadow-sm active:scale-95 transition-transform" 
                                                title="Reset Pairing"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
                    Menampilkan {filteredDevices.length} dari {devices.length} total perangkat.
                </div>
            </div>

            {/* --- MODAL 1: CREATE DEVICE --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl scale-100 transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">Register Device Baru</h3>
                            <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Device ID (Unik)</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                                        <Tag size={18}/>
                                    </div>
                                    <input 
                                        value={deviceIdInput} 
                                        onChange={e => setDeviceIdInput(e.target.value)} 
                                        placeholder="Contoh: GPS-001" 
                                        className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm uppercase transition-all" 
                                        required 
                                        autoFocus
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1">ID ini akan ditempel pada alat fisik GPS.</p>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
                                Simpan & Generate Kode
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: SETUP SIM CARD --- */}
            {simModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl scale-100 transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Konfigurasi SIM</h3>
                                <p className="text-xs text-slate-500">Edit data kartu untuk device <span className="font-mono font-bold text-indigo-600">{simModal.data.deviceId}</span></p>
                            </div>
                            <button onClick={() => setSimModal({ isOpen: false, deviceId: null, data: {} })} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
                        </div>
                        
                        <form onSubmit={onSimSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Provider</label>
                                <input name="simProvider" defaultValue={simModal.data.simProvider} placeholder="Contoh: Telkomsel" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Nomor HP</label>
                                <input name="simNumber" defaultValue={simModal.data.simNumber} placeholder="0812xxxx" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-mono transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Total Kuota (MB)</label>
                                <div className="relative">
                                    <input name="dataLimitMB" type="number" step="0.1" defaultValue={simModal.data.dataLimitMB} placeholder="1000" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-bold transition-all" />
                                    <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">MB</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-xl border border-amber-100">
                                <input type="checkbox" name="resetUsage" id="reset" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                <label htmlFor="reset" className="text-xs text-amber-800 font-bold cursor-pointer select-none">Reset Data Pemakaian (Mulai dari 0)</label>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-2">
                                Simpan Perubahan
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDevicesPage;