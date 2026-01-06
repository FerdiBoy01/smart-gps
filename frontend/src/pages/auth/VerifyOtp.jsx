import useVerifyOtp from '../../hooks/useVerifyOtp';
import { ShieldCheck, Timer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Tambah navigasi manual jika perlu
import Alert from '../../components/Alert';

const VerifyOtp = () => {
    const { email, setOtpCode, status, timeLeft, handleSubmit, handleCloseAlert } = useVerifyOtp();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8 font-sans">
            {status.alert && (
                <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
                    <div className="w-full max-w-md">
                        <Alert type={status.alert.type} message={status.alert.message} onClose={handleCloseAlert} />
                    </div>
                </div>
            )}
            
            <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl border-t-8 border-orange-500 p-8 relative">
                {/* Back Button (Opsional) */}
                <button onClick={() => navigate('/login')} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>

                <div className="flex justify-center mb-6 mt-2">
                    <div className="p-4 bg-orange-50 rounded-full ring-8 ring-orange-50/50">
                        <ShieldCheck className="w-12 h-12 text-orange-500" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-2">Verifikasi OTP</h2>
                <p className="text-center text-slate-500 text-sm mb-8 px-4">
                    Masukkan 4 digit kode yang telah kami kirimkan ke email <b>{email || 'anda'}</b>
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input 
                            type="text" 
                            onChange={(e) => setOtpCode(e.target.value)} 
                            maxLength="4" 
                            placeholder="0000" 
                            className="w-full py-5 text-center text-5xl font-mono font-bold tracking-[1rem] bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-800 placeholder:text-slate-200" 
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <div className={`flex items-center gap-2 text-sm font-bold ${timeLeft > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                            <Timer className="w-4 h-4"/> 
                            {timeLeft > 0 ? `Sisa waktu: ${timeLeft} detik` : 'Waktu habis'}
                        </div>
                        {timeLeft === 0 && (
                            <button type="button" className="text-xs text-slate-500 hover:text-slate-800 underline mt-1">
                                Kirim ulang kode
                            </button>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={status.loading} 
                        className="w-full py-3.5 font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {status.loading ? 'Memverifikasi...' : 'Verifikasi Kode'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;