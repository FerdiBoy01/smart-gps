import useVerifyOtp from '../../hooks/useVerifyOtp'; // Import Hook
import { ShieldCheck, Timer } from 'lucide-react';
import Alert from '../../components/Alert';

const VerifyOtp = () => {
    // Panggil Logic dari Hook
    const { email, setOtpCode, status, timeLeft, handleSubmit, handleCloseAlert } = useVerifyOtp();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
            {status.alert && <Alert type={status.alert.type} message={status.alert.message} onClose={handleCloseAlert} />}
            
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border-t-4 border-orange-500 p-8">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-orange-100 rounded-full"><ShieldCheck className="w-10 h-10 text-orange-600" /></div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Verifikasi OTP</h2>
                <p className="text-center text-slate-500 text-sm mb-6">Kode dikirim ke <b>{email}</b></p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input 
                        type="text" 
                        onChange={(e) => setOtpCode(e.target.value)} 
                        maxLength="4" 
                        placeholder="0000" 
                        className="w-full py-4 text-center text-4xl font-bold tracking-[1rem] border-2 rounded-xl focus:border-orange-500 focus:outline-none" 
                    />
                    
                    <div className="text-center text-sm text-slate-500 flex justify-center items-center gap-2">
                        <Timer className="w-4 h-4"/> Sisa waktu: {timeLeft}s
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={status.loading} 
                        className="w-full py-3 font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all">
                        {status.loading ? 'Memverifikasi...' : 'Verifikasi Kode'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;