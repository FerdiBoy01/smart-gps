import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/authService';

const useVerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State
    const [email, setEmail] = useState(location.state?.email || '');
    const [otpCode, setOtpCode] = useState('');
    const [status, setStatus] = useState({ loading: false, alert: null });
    const [timeLeft, setTimeLeft] = useState(60);

    // Timer Logic
    useEffect(() => {
        if (!timeLeft) return;
        const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, alert: null });
        try {
            await verifyOtp({ email, otpCode });
            setStatus({ loading: false, alert: { type: 'success', message: 'Verifikasi Berhasil!' } });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            setStatus({ loading: false, alert: { type: 'error', message: 'OTP Salah/Kadaluarsa' } });
        }
    };

    const handleCloseAlert = () => setStatus({ ...status, alert: null });

    // Kembalikan semua data & fungsi yang dibutuhkan UI
    return {
        email,
        otpCode,
        setOtpCode,
        status,
        timeLeft,
        handleSubmit,
        handleCloseAlert
    };
};

export default useVerifyOtp;