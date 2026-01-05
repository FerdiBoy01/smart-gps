import { useState } from 'react';
import { Smartphone, Signal, Trash2, Edit2, Check, X } from 'lucide-react';
import { updateDeviceName, unpairDevice } from '../../services/deviceService';

const DevicesTab = ({ devices, setDevices }) => { // Terima setDevices untuk update state lokal
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    // Mulai Edit
    const startEdit = (dev) => {
        setEditingId(dev.id);
        setEditName(dev.name);
    };

    // Simpan Edit
    const saveEdit = async (id) => {
        try {
            await updateDeviceName(id, editName);
            // Update UI State tanpa reload
            setDevices(devices.map(d => d.id === id ? { ...d, name: editName } : d));
            setEditingId(null);
        } catch (error) {
            alert("Gagal update nama device");
        }
    };

    // Hapus Device
    const handleDelete = async (id) => {
        if (confirm("Yakin ingin menghapus device ini? Anda harus pairing ulang nanti.")) {
            try {
                await unpairDevice(id);
                setDevices(devices.filter(d => d.id !== id)); // Buang dari list UI
            } catch (error) {
                alert("Gagal menghapus device");
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4">Device & SIM</h2>
            <div className="space-y-3">
                {devices.map(dev => (
                    <div key={dev.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-full ${dev.lastActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Smartphone size={20} />
                            </div>
                            <div className="flex-1">
                                {editingId === dev.id ? (
                                    <div className="flex gap-2">
                                        <input 
                                            value={editName} 
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="border p-1 rounded text-sm w-full"
                                        />
                                        <button onClick={() => saveEdit(dev.id)} className="bg-green-100 text-green-600 p-1 rounded"><Check size={16}/></button>
                                        <button onClick={() => setEditingId(null)} className="bg-red-100 text-red-600 p-1 rounded"><X size={16}/></button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-slate-800 text-sm">{dev.name}</h3>
                                        <p className="text-xs text-slate-500 font-mono">ID: {dev.deviceId}</p>
                                    </>
                                )}
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded mt-1 inline-flex items-center gap-1">
                                    <Signal size={10} /> {dev.simProvider || 'No SIM'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 border-t pt-3">
                            <button onClick={() => startEdit(dev)} className="flex-1 py-1.5 border rounded-lg text-xs font-medium hover:bg-slate-50 flex justify-center items-center gap-1">
                                <Edit2 size={14}/> Edit Nama
                            </button>
                            <button onClick={() => handleDelete(dev.id)} className="flex-1 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 flex justify-center items-center gap-1">
                                <Trash2 size={14} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DevicesTab;