import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Alert from '../components/Alert';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await registerUser(formData);
            setAlert({ type: 'success', message: 'Registrasi Berhasil! Mengirim OTP...' });
            setTimeout(() => {
                navigate('/verify-otp', { state: { email: formData.email } });
            }, 1500);
        } catch (error) {
            setAlert({ type: 'error', message: error.response?.data?.message || 'Registrasi Gagal' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
            
            {/* Alert ditaruh di sini (di atas card) */}
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border-t-4 border-blue-600 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-800">Buat Akun</h2>
                        <p className="text-slate-500 mt-2 text-sm">Bergabunglah untuk akses Smart GPS</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input name="username" type="text" onChange={handleChange} placeholder="Username" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input name="email" type="email" onChange={handleChange} placeholder="Alamat Email" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input name="password" type="password" onChange={handleChange} placeholder="Password" required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/30 mt-6">
                            {loading ? 'Memproses...' : (
                                <>Daftar Sekarang <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Sudah punya akun? <Link to="/login" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">Login disini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;