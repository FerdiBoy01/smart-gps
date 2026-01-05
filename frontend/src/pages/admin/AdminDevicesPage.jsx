import { useState } from 'react';
import useAdminDevices from '../../hooks/useAdminDevices';
import { Smartphone, Plus, RotateCcw, User, Tag, X, Signal, CheckCircle } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminDevicesPage = () => {
    const { 
        devices, loading, alert, isModalOpen, deviceIdInput,
        setDeviceIdInput, setModalOpen, setAlert,
        handleCreate, handleReset, handleUpdateSim // Pastikan ini ada di hook
    } = useAdminDevices();

    // State untuk Modal SIM
    const [simModal, setSimModal] = useState({ isOpen: false, deviceId: null, data: {} });

    // Handler Submit Form SIM
    const onSimSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const payload = {
            simProvider: formData.get('simProvider'),
            simNumber: formData.get('simNumber'),
            dataLimitMB: formData.get('dataLimitMB'),
            resetUsage: formData.get('resetUsage') === 'on' // Checkbox value
        };

        handleUpdateSim(simModal.deviceId, payload);
        setSimModal({ isOpen: false, deviceId: null, data: {} });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Inventaris Perangkat GPS</h1>
                    <p className="text-slate-500 text-sm">Kelola pairing code dan data kartu SIM</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-colors">
                    <Plus size={18} /> Generate Device
                </button>
            </div>

            {/* Alert */}
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            {/* Tabel Devices */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">Device ID</th>
                            <th className="p-4">Pairing Code</th>
                            <th className="p-4">Info SIM</th>
                            <th className="p-4">Pemilik</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? <tr><td colSpan="6" className="p-4 text-center">Memuat data...</td></tr> : devices.map(dev => (
                            <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono font-bold text-slate-700">{dev.deviceId}</td>
                                <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono font-bold tracking-wider">{dev.pairingCode}</span></td>
                                <td className="p-4">
                                    {dev.simProvider ? (
                                        <div>
                                            <div className="font-bold text-slate-700">{dev.simProvider}</div>
                                            <div className="text-xs text-slate-500">{dev.simNumber}</div>
                                            <div className="text-[10px] text-slate-400 mt-1">Limit: {dev.dataLimitMB} MB</div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic text-xs">- Belum diset -</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {dev.owner ? (
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <User size={14}/> <span className="font-medium">{dev.owner.username}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Unpaired</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 ${dev.userId ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {dev.userId ? <><CheckCircle size={12}/> Paired</> : 'Unpaired'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        {/* Tombol Setup SIM */}
                                        <button 
                                            onClick={() => setSimModal({ isOpen: true, deviceId: dev.id, data: dev })} 
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded transition-colors" 
                                            title="Setup SIM Card"
                                        >
                                            <Signal size={18} />
                                        </button>
                                        {/* Tombol Reset Pairing */}
                                        <button 
                                            onClick={() => handleReset(dev.id)} 
                                            className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded transition-colors" 
                                            title="Reset Pairing"
                                        >
                                            <RotateCcw size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && devices.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada device dibuat.</div>}
            </div>

            {/* MODAL 1: CREATE DEVICE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Buat Device Baru</h3><button onClick={() => setModalOpen(false)}><X/></button></div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Device ID (Unik)</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-2.5 text-slate-400 w-5 h-5"/>
                                    <input value={deviceIdInput} onChange={e => setDeviceIdInput(e.target.value)} placeholder="Contoh: GPS-001" className="w-full pl-10 p-2 border rounded-lg uppercase font-mono" required />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Buat Sekarang</button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: SETUP SIM CARD */}
            {simModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Setup Kartu SIM</h3><button onClick={() => setSimModal({ isOpen: false, deviceId: null, data: {} })}><X/></button></div>
                        
                        <form onSubmit={onSimSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Provider</label>
                                <input name="simProvider" defaultValue={simModal.data.simProvider} placeholder="Contoh: Telkomsel" className="w-full border p-2 rounded focus:border-indigo-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Nomor HP</label>
                                <input name="simNumber" defaultValue={simModal.data.simNumber} placeholder="0812xxxx" className="w-full border p-2 rounded focus:border-indigo-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Total Kuota (MB)</label>
                                <div className="flex items-center gap-2">
                                    <input name="dataLimitMB" type="number" step="0.1" defaultValue={simModal.data.dataLimitMB} placeholder="1000" className="w-full border p-2 rounded focus:border-indigo-500 focus:outline-none" />
                                    <span className="text-sm font-bold text-slate-500">MB</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <input type="checkbox" name="resetUsage" id="reset" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                <label htmlFor="reset" className="text-sm text-yellow-800 font-medium cursor-pointer">Reset Pemakaian (Isi Ulang)</label>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Simpan Setting</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDevicesPage;