import { useState } from 'react';
import { Key, X } from 'lucide-react';
import { changePasswordAPI } from '../../services/authService';

const ProfileTab = ({ profile, setProfile }) => {
    const [showPassModal, setShowPassModal] = useState(false);
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePasswordAPI(passData);
            alert("Password berhasil diganti!");
            setShowPassModal(false);
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            alert(error.response?.data?.message || "Gagal ganti password");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-4">Profil & Akun</h2>
            
            {/* --- BAGIAN FORM INPUT (INI YANG TADI HILANG) --- */}
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                    <input 
                        value={profile.username} 
                        onChange={e => setProfile({...profile, username: e.target.value})} 
                        className="w-full border border-slate-300 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700" 
                        placeholder="Masukkan username"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                    <input 
                        value={profile.email} 
                        disabled 
                        className="w-full border border-slate-200 p-3 rounded-xl mt-1 bg-slate-100 text-slate-500 cursor-not-allowed font-medium" 
                    />
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">*Email tidak dapat diubah</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nomor Telepon</label>
                    <input 
                        value={profile.phone} 
                        onChange={e => setProfile({...profile, phone: e.target.value})} 
                        className="w-full border border-slate-300 p-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700" 
                        placeholder="Contoh: 08123456789"
                    />
                </div>
            </div>

            {/* --- TOMBOL GANTI PASSWORD --- */}
            <div className="pt-6 border-t mt-6">
                <button 
                    onClick={() => setShowPassModal(true)} 
                    className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto justify-center border border-blue-100 shadow-sm"
                >
                    <Key size={18} /> Ganti Password
                </button>
            </div>

            {/* --- MODAL POPUP GANTI PASSWORD --- */}
            {showPassModal && (
                <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">Ganti Password</h3>
                            <button onClick={() => setShowPassModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20}/>
                            </button>
                        </div>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase ml-1">Password Lama</label>
                                <input 
                                    type="password" 
                                    className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                                    onChange={e => setPassData({...passData, oldPassword: e.target.value})}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase ml-1">Password Baru</label>
                                <input 
                                    type="password" 
                                    className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                                    onChange={e => setPassData({...passData, newPassword: e.target.value})}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-2">
                                Simpan Password Baru
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTab;