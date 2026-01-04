import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const useLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, alert: null });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, alert: null });
        try {
            const data = await loginUser(formData);
            setStatus({ loading: false, alert: { type: 'success', message: `Selamat datang, ${data.user.username}!` } });
            
            setTimeout(() => {
                if (data.user.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }, 1500);
        } catch (error) {
            setStatus({ loading: false, alert: { type: 'error', message: error.response?.data?.message || 'Login Gagal' } });
        }
    };

    const handleCloseAlert = () => setStatus({ ...status, alert: null });

    return { formData, status, handleInputChange, handleLoginSubmit, handleCloseAlert };
};

export default useLogin;