import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../services/adminService';
import { Trash2, Shield, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'))?.user;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Gagal ambil data user', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus user ini?')) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user.id !== id)); // Update UI tanpa reload
            } catch (error) {
                alert('Gagal menghapus user');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar Admin */}
            <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-orange-400" />
                    <span className="font-bold text-xl tracking-wide">Admin Panel</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-blue-200">Halo, {currentUser?.username}</div>
                    <button onClick={handleLogout} className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm transition-colors">
                        <LogOut className="w-4 h-4 mr-1" /> Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Kelola Pengguna</h1>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 uppercase text-sm font-semibold">
                                    <th className="p-4 border-b">ID</th>
                                    <th className="p-4 border-b">Username</th>
                                    <th className="p-4 border-b">Email</th>
                                    <th className="p-4 border-b">Role</th>
                                    <th className="p-4 border-b">Status</th>
                                    <th className="p-4 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-blue-50 transition-colors border-b last:border-b-0">
                                        <td className="p-4 font-mono text-slate-500">#{user.id}</td>
                                        <td className="p-4 font-medium">{user.username}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${
                                                user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.role !== 'admin' && ( // Jangan hapus sesama admin
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all"
                                                    title="Hapus User">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && (
                        <div className="p-8 text-center text-slate-500">Belum ada user terdaftar.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;