import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(formData);
            alert('Registrasi berhasil! Cek email untuk OTP.');
            // Pindah ke halaman OTP sambil membawa email user
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            alert(error.response?.data?.message || 'Registrasi gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Daftar Smart GPS</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Username</label>
                        <input name="username" type="text" onChange={handleChange} required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input name="email" type="email" onChange={handleChange} required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <input name="password" type="password" onChange={handleChange} required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login disini</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;