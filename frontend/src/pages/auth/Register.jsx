import useRegister from '../../hooks/useRegister';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Alert from '../../components/Alert';

const Register = () => {
    const { handleInputChange, handleRegisterSubmit, status, handleCloseAlert } = useRegister();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            {status.alert && (
                <Alert
                    type={status.alert.type}
                    message={status.alert.message}
                    onClose={handleCloseAlert}
                />
            )}

            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden border-t-4 border-blue-600">
                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">
                        Buat Akun
                    </h2>
                    <p className="text-center text-slate-500 mb-8 text-sm">
                        Daftar untuk mulai menggunakan aplikasi
                    </p>

                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                name="username"
                                type="text"
                                onChange={handleInputChange}
                                placeholder="Username"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                name="email"
                                type="email"
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                name="password"
                                type="password"
                                onChange={handleInputChange}
                                placeholder="Password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status.loading}
                            className="w-full py-3 mt-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {status.loading ? (
                                'Memproses...'
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Sudah punya akun?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-orange-500 hover:underline"
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
