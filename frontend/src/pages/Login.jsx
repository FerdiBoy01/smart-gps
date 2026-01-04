import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData);
            alert(`Selamat datang, ${data.user.username}!`);
            navigate('/dashboard'); // Nanti kita buat dashboardnya
        } catch (error) {
            alert(error.response?.data?.message || 'Login gagal');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login Smart GPS</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button type="submit"
                        className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Masuk
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar disini</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;