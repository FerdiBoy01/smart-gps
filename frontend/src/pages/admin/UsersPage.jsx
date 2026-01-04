import useUsers from '../../hooks/useUsers';
import { Trash2, Edit, Plus, X, CheckCircle } from 'lucide-react';
import Alert from '../../components/Alert';

const UsersPage = () => {
    const { 
        users, alert, modal, formData, 
        handleInputChange, handleSave, handleDelete, 
        openAdd, openEdit, closeModal, closeAlert 
    } = useUsers();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen User</h1>
                <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={18}/> Tambah</button>
            </div>
            
            {alert && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
            
            {/* TABEL */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-center">Aksi</th></tr></thead>
                    <tbody className="divide-y text-sm">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="p-4"><div>{u.username}</div><div className="text-xs text-slate-500">{u.email}</div></td>
                                <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                                <td className="p-4">{u.isVerified ? <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle size={14}/> Verified</span> : <span className="text-orange-500 font-bold">Pending</span>}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button onClick={() => openEdit(u)} className="text-blue-500 p-2"><Edit size={18}/></button>
                                    {u.role !== 'admin' && <button onClick={() => handleDelete(u.id)} className="text-red-500 p-2"><Trash2 size={18}/></button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">{modal.isEdit ? 'Edit User' : 'Tambah User'}</h3><button onClick={closeModal}><X/></button></div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" required className="w-full border p-2 rounded" />
                            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full border p-2 rounded" />
                            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border p-2 rounded bg-white"><option value="user">User</option><option value="admin">Admin</option></select>
                            <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder={modal.isEdit ? "Kosongkan jika tidak ganti" : "Password"} required={!modal.isEdit} className="w-full border p-2 rounded" />
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">Simpan</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UsersPage;