import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const useRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, alert: null });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, alert: null });
        try {
            await registerUser(formData);
            setStatus({ loading: false, alert: { type: 'success', message: 'Registrasi Berhasil! Mengirim OTP...' } });
            setTimeout(() => {
                navigate('/verify-otp', { state: { email: formData.email } });
            }, 1500);
        } catch (error) {
            setStatus({ loading: false, alert: { type: 'error', message: error.response?.data?.message || 'Registrasi Gagal' } });
        }
    };

    const handleCloseAlert = () => setStatus({ ...status, alert: null });

    return { formData, status, handleInputChange, handleRegisterSubmit, handleCloseAlert };
};

export default useRegister;