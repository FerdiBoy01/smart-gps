import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/authService';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = location.state?.email || ''; // Ambil email dari halaman sebelumnya
    
    const [otpCode, setOtpCode] = useState('');
    const [email, setEmail] = useState(emailFromState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOtp({ email, otpCode });
            alert('Akun terverifikasi! Silakan login.');
            navigate('/login');
        } catch (error) {
            alert('OTP Salah atau Kadaluarsa');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">Verifikasi OTP</h2>
                <p className="mb-6 text-sm text-center text-gray-600">Kode dikirim ke email kamu.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-2 bg-gray-100 border rounded-md" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Kode OTP</label>
                        <input type="text" onChange={(e) => setOtpCode(e.target.value)} required maxLength="4" placeholder="XXXX"
                            className="w-full px-4 py-2 text-center text-2xl tracking-widest border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <button type="submit"
                        className="w-full py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                        Verifikasi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;