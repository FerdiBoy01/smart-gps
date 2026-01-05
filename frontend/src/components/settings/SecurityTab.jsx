import { LogOut } from 'lucide-react';

const SecurityTab = ({ onLogout }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4">Keamanan</h2>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
                <div><h3 className="font-bold text-blue-800 text-sm">2-Factor Auth</h3><p className="text-xs text-blue-600">Verifikasi email saat login</p></div>
                <input type="checkbox" className="w-5 h-5 accent-blue-600" />
            </div>
            <button onClick={onLogout} className="w-full border border-red-200 bg-red-50 text-red-600 font-bold py-3 rounded-xl mt-4 hover:bg-red-100 flex justify-center items-center gap-2 text-sm">
                <LogOut size={18} /> Logout Semua Sesi
            </button>
        </div>
    );
};

export default SecurityTab;