import useRegister from '../../hooks/useRegister';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Alert from '../../components/Alert';

const Register = () => {
    const { handleInputChange, handleRegisterSubmit, status, handleCloseAlert } = useRegister();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
            {status.alert && <Alert type={status.alert.type} message={status.alert.message} onClose={handleCloseAlert} />}
            
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border-t-4 border-blue-600 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-8">Buat Akun</h2>
                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3"><User className="w-5 h-5 text-gray-400" /></div><input name="username" type="text" onChange={handleInputChange} placeholder="Username" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="w-5 h-5 text-gray-400" /></div><input name="email" type="email" onChange={handleInputChange} placeholder="Email" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3"><Lock className="w-5 h-5 text-gray-400" /></div><input name="password" type="password" onChange={handleInputChange} placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                        <button type="submit" disabled={status.loading} className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 mt-6 flex justify-center items-center">{status.loading ? 'Memproses...' : <>Daftar Sekarang <ArrowRight className="ml-2 w-4 h-4" /></>}</button>
                    </form>
                </div>
                <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">Sudah punya akun? <Link to="/login" className="font-bold text-orange-500 hover:underline">Login disini</Link></p>
                </div>
            </div>
        </div>
    );
};
export default Register;