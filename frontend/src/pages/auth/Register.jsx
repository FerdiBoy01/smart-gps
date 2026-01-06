import useRegister from '../../hooks/useRegister';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, MapPin } from 'lucide-react';
import Alert from '../../components/Alert';

const Register = () => {
    const { handleInputChange, handleRegisterSubmit, status, handleCloseAlert } = useRegister();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 font-sans">
            {status.alert && (
                <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
                    <div className="w-full max-w-md">
                        <Alert type={status.alert.type} message={status.alert.message} onClose={handleCloseAlert} />
                    </div>
                </div>
            )}

            <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-slate-100 overflow-hidden">
                <div className="p-8 pt-10">
                    {/* Header Logo */}
                    <div className="flex flex-col items-center mb-8">
                         <div className="bg-blue-50 p-3 rounded-2xl mb-3">
                            <MapPin className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800">Buat Akun Baru</h2>
                        <p className="text-center text-slate-500 text-sm mt-1">
                            Daftarkan diri Anda untuk mulai monitoring
                        </p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    onChange={handleInputChange}
                                    placeholder="Username"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    onChange={handleInputChange}
                                    placeholder="nama@email.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status.loading}
                            className="w-full py-3.5 mt-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {status.loading ? (
                                'Mendaftarkan...'
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                        Sudah punya akun?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;