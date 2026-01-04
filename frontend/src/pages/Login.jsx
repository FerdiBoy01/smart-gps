import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { Mail, Lock, LogIn } from 'lucide-react';
import Alert from '../components/Alert';

const Login = () => {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, alert: null });
    const navigate = useNavigate();

    // --- HANDLERS (LOGIC) ---
    
    // 1. Handle Input Change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Handle Submit & Role Redirection
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, alert: null }); // Reset status

        try {
            const data = await loginUser(formData);
            const userRole = data.user.role; // Ambil role dari response backend

            setStatus({ 
                loading: false, 
                alert: { type: 'success', message: `Selamat datang, ${data.user.username}!` } 
            });

            // Logika Redirect Berdasarkan Role
            setTimeout(() => {
                if (userRole === 'admin') {
                    navigate('/admin'); // Admin ke Dashboard Admin
                } else {
                    navigate('/dashboard'); // User Biasa ke Dashboard User
                }
            }, 1500);

        } catch (error) {
            setStatus({ 
                loading: false, 
                alert: { type: 'error', message: error.response?.data?.message || 'Login Gagal' } 
            });
        }
    };

    // --- VIEW (JSX) ---
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
            
            {status.alert && (
                <Alert 
                    type={status.alert.type} 
                    message={status.alert.message} 
                    onClose={() => setStatus({ ...status, alert: null })} 
                />
            )}

            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border-t-4 border-blue-600 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-800">Login</h2>
                        <p className="text-slate-500 mt-2 text-sm">Masuk sebagai User atau Admin</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input 
                                name="email" 
                                type="email" 
                                onChange={handleInputChange} 
                                placeholder="Email" 
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" 
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input 
                                name="password" 
                                type="password" 
                                onChange={handleInputChange} 
                                placeholder="Password" 
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={status.loading}
                            className="w-full flex items-center justify-center py-3 px-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50">
                            {status.loading ? 'Memproses...' : (
                                <><LogIn className="mr-2 w-4 h-4" /> Masuk</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Belum punya akun? <Link to="/register" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">Daftar sekarang</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;