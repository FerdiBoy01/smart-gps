import { useState, useEffect } from 'react';
import useUsers from '../../hooks/useUsers';
import { getAllDevices, unpairDevice } from '../../services/deviceService';
import { 
    Trash2, Edit, Plus, X, CheckCircle, Search, 
    User, Car, Unlink, Smartphone, ChevronLeft, ChevronRight, Phone 
} from 'lucide-react';
import Alert from '../../components/Alert';

const UsersPage = () => {
    // Hook User (CRUD User)
    const { 
        users, alert, modal, formData, 
        handleInputChange, handleSave, handleDelete, 
        openAdd, openEdit, closeModal, closeAlert, setAlert
    } = useUsers();

    // State Tambahan
    const [allDevices, setAllDevices] = useState([]);
    const [selectedUserDevices, setSelectedUserDevices] = useState(null);
    const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Load Devices
    useEffect(() => {
        fetchDevices();
    }, [users]);

    const fetchDevices = async () => {
        try {
            const data = await getAllDevices();
            setAllDevices(data);
        } catch (error) {
            console.error("Gagal load device", error);
        }
    };

    // 1. FILTERING
    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone && u.phone.includes(searchTerm))
    );

    // 2. PAGINATION LOGIC
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getUserDeviceCount = (userId) => {
        return allDevices.filter(d => d.userId === userId).length;
    };

    const isDeviceOnline = (lastActive) => {
        if (!lastActive) return false;
        return (new Date() - new Date(lastActive)) < 5 * 60 * 1000;
    };

    const handleViewAssets = (user) => {
        const userDevs = allDevices.filter(d => d.userId === user.id);
        setSelectedUserDevices({ user, devices: userDevs });
        setIsDeviceModalOpen(true);
    };

    const handleUnpairFromUser = async (deviceId) => {
        if(!confirm("Yakin ingin melepas perangkat ini dari user?")) return;
        try {
            await unpairDevice(deviceId);
            setAlert({ type: 'success', message: 'Perangkat berhasil dilepas.' });
            
            const updatedDevices = allDevices.map(d => 
                d.id === deviceId ? { ...d, userId: null, owner: null } : d
            );
            setAllDevices(updatedDevices);
            
            if (selectedUserDevices) {
                setSelectedUserDevices(prev => ({
                    ...prev,
                    devices: prev.devices.filter(d => d.id !== deviceId)
                }));
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Gagal unpair device.' });
        }
    };

    return (
        <div className="p-6 md:p-8 font-sans min-h-screen bg-slate-50">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Data Pelanggan & Aset</h1>
                    <p className="text-slate-500 text-sm">Kelola akun pengguna, nomor kontak, dan aset mereka.</p>
                </div>
                <button 
                    onClick={openAdd} 
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                >
                    <Plus size={18}/> Tambah User
                </button>
            </div>
            
            {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} onClose={closeAlert} /></div>}
            
            {/* --- SEARCH BAR --- */}
            <div className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex items-center gap-3">
                <Search className="text-slate-400" size={20}/>
                <input 
                    type="text" 
                    placeholder="Cari Nama, Email, atau No HP..." 
                    className="flex-1 outline-none text-sm font-medium text-slate-700 placeholder:font-normal"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* --- TABEL USER --- */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5">Profil Pengguna</th>
                                <th className="p-5">Kontak (WA)</th>
                                <th className="p-5">Role & Status</th>
                                <th className="p-5">Aset Terdaftar</th>
                                <th className="p-5 text-center">Kelola</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {currentUsers.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-slate-400">Tidak ada data user.</td></tr>
                            ) : currentUsers.map(u => {
                                const deviceCount = getUserDeviceCount(u.id);
                                return (
                                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg uppercase border border-slate-200">
                                                    {u.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{u.username}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="p-5">
                                            {u.phone ? (
                                                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">
                                                    <Phone size={14} className="text-green-600"/>
                                                    <span className="font-mono text-xs">{u.phone}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">- Belum diset -</span>
                                            )}
                                        </td>

                                        <td className="p-5">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                    u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {u.role}
                                                </span>
                                                {u.isVerified && <span className="text-green-600 text-[10px] flex items-center gap-1 font-bold"><CheckCircle size={10}/> Verified</span>}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {deviceCount > 0 ? (
                                                <button 
                                                    onClick={() => handleViewAssets(u)}
                                                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors group/btn"
                                                >
                                                    <Car size={16} />
                                                    <span className="font-bold">{deviceCount} Unit</span>
                                                    <span className="text-[10px] bg-white px-1.5 rounded border border-indigo-100 opacity-60 group-hover/btn:opacity-100">Lihat Detail</span>
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic flex items-center gap-1">
                                                    <Smartphone size={14}/> Belum ada aset
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEdit(u)} className="bg-white border border-blue-100 text-blue-600 p-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors" title="Edit Profil">
                                                    <Edit size={16}/>
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => handleDelete(u.id)} className="bg-white border border-red-100 text-red-500 p-2 rounded-lg shadow-sm hover:bg-red-50 transition-colors" title="Hapus User">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* --- PAGINATION FOOTER --- */}
                {filteredUsers.length > 0 && (
                    <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                            Menampilkan <b>{indexOfFirstItem + 1}</b> - <b>{Math.min(indexOfLastItem, filteredUsers.length)}</b> dari <b>{filteredUsers.length}</b> user
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold ${
                                        currentPage === i + 1 
                                        ? 'bg-blue-600 text-white' 
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

            {/* --- MODAL 1: FORM USER --- */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">{modal.isEdit ? 'Edit Data Pelanggan' : 'Registrasi User Baru'}</h3>
                            <button onClick={closeModal}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Username</label>
                                <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Nama User" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Email</label>
                                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
                            </div>
                            
                            {/* INPUT NO HP */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">No. WhatsApp</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-slate-400 pointer-events-none"><Phone size={18}/></div>
                                    <input 
                                        name="phone" 
                                        value={formData.phone || ''} 
                                        onChange={handleInputChange} 
                                        placeholder="Contoh: 081234567890" 
                                        className="w-full pl-10 p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Role</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Password {modal.isEdit && "(Opsional)"}</label>
                                <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder={modal.isEdit ? "Biarkan kosong jika tidak ubah" : "Password"} required={!modal.isEdit} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 mt-2">Simpan Data</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: LIHAT ASET USER --- */}
            {isDeviceModalOpen && selectedUserDevices && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-0 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Daftar Aset Terdaftar</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <User size={14} className="text-slate-400"/>
                                    <span className="text-sm text-slate-600 font-medium">{selectedUserDevices.user.username}</span>
                                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded text-[10px] text-green-700 font-bold border border-green-100">
                                        <Phone size={10}/> {selectedUserDevices.user.phone || 'No Phone'}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsDeviceModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full"><X size={20} className="text-slate-400"/></button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {selectedUserDevices.devices.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <Unlink size={48} className="mx-auto mb-2 opacity-20"/>
                                    <p>User ini tidak memiliki perangkat terdaftar.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedUserDevices.devices.map(dev => {
                                        const online = isDeviceOnline(dev.lastActive);
                                        return (
                                            <div key={dev.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-300 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${online ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Car size={24}/>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{dev.name || 'Tanpa Nama'}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                                online ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                                                            }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                                {online ? 'ONLINE' : 'OFFLINE'}
                                                            </span>
                                                            <span className="text-[10px] font-mono text-slate-400">ID: {dev.deviceId}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => handleUnpairFromUser(dev.id)}
                                                    className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                    title="Lepas Kaitan (Unpair)"
                                                >
                                                    <Unlink size={18} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;