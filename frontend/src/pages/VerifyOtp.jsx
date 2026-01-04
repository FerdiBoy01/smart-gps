import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/authService';
import { ShieldCheck, Timer } from 'lucide-react';
import Alert from '../components/Alert';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = location.state?.email || '';
    
    const [otpCode, setOtpCode] = useState('');
    const [email, setEmail] = useState(emailFromState);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Timer State
    const [timeLeft, setTimeLeft] = useState(60); // 60 detik

    // Logika Hitung Mundur
    useEffect(() => {
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    // Format Waktu MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await verifyOtp({ email, otpCode });
            setAlert({ type: 'success', message: 'Verifikasi Berhasil! Mengalihkan...' });
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            setAlert({ type: 'error', message: 'Kode OTP Salah atau Kadaluarsa' });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setAlert({ type: 'success', message: 'Kode OTP baru telah dikirim!' });
        setTimeLeft(60); // Reset timer
        // Di sini nanti panggil API kirim ulang OTP
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
            
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border-t-4 border-orange-500 overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-orange-100 rounded-full animate-pulse">
                            <ShieldCheck className="w-10 h-10 text-orange-600" />
                        </div>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-center text-slate-800">Verifikasi Keamanan</h2>
                    <p className="mb-6 text-sm text-center text-slate-500">
                        Kode 4 digit dikirim ke <br/> 
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">{email}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input OTP Besar */}
                        <div>
                            <input type="text" onChange={(e) => setOtpCode(e.target.value)} required maxLength="4" placeholder="0000"
                                className="w-full px-4 py-4 text-center text-4xl font-bold tracking-[1rem] border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700 placeholder-slate-300" />
                        </div>

                        {/* Indikator Waktu */}
                        <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                            <Timer className="w-4 h-4" />
                            <span>Sisa waktu: <span className="font-mono font-bold text-slate-700">{formatTime(timeLeft)}</span></span>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-200 transition-all shadow-lg hover:shadow-orange-500/30">
                            {loading ? 'Memverifikasi...' : 'Verifikasi Kode'}
                        </button>
                    </form>
                </div>
                
                <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Tidak menerima kode? <br className="sm:hidden"/>
                        {timeLeft > 0 ? (
                            <span className="text-slate-400 font-medium ml-1">Kirim ulang dalam {timeLeft}s</span>
                        ) : (
                            <button onClick={handleResend} className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1">
                                Kirim Ulang Sekarang
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;