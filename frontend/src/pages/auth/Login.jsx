import useLogin from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Alert from '../../components/Alert';

const Login = () => {
    const { handleInputChange, handleLoginSubmit, status, handleCloseAlert } = useLogin();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
            {status.alert && <Alert type={status.alert.type} message={status.alert.message} onClose={handleCloseAlert} />}
            
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border-t-4 border-blue-600 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-8">Login</h2>
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
                            <input name="email" type="email" onChange={handleInputChange} placeholder="Email" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
                            <input name="password" type="password" onChange={handleInputChange} placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <button type="submit" disabled={status.loading} className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center">
                            {status.loading ? 'Memproses...' : <><LogIn className="mr-2 w-4 h-4" /> Masuk</>}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">Belum punya akun? <Link to="/register" className="font-bold text-orange-500 hover:underline">Daftar sekarang</Link></p>
                </div>
            </div>
        </div>
    );
};
export default Login;