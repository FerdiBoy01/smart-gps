import { useState, useEffect } from 'react';
import { createReport, getMyReports } from '../../services/reportService';
import { 
    MessageSquare, Send, CheckCircle, Clock, ChevronDown, 
    ArrowLeft, HelpCircle, FileText, Loader2, MessageCircleWarning,
    User, Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';

const ReportPage = () => {
    const navigate = useNavigate();

    // State Data
    const [reports, setReports] = useState([]);
    const [form, setForm] = useState({ subject: '', message: '' });
    
    // State UI
    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null);

    useEffect(() => { 
        loadReports(); 
    }, []);

    const loadReports = async () => {
        setIsLoadingData(true);
        try {
            const data = await getMyReports();
            setReports(data);
        } catch (error) { 
            console.error(error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlertMsg(null);

        try {
            await createReport(form);
            setForm({ subject: '', message: '' });
            setAlertMsg({ type: 'success', message: 'Laporan berhasil dikirim! Admin akan segera membalas.' });
            loadReports();
        } catch (error) {
            setAlertMsg({ type: 'error', message: 'Gagal mengirim laporan. Cek koneksi internet.' });
        } finally {
            setLoading(false);
            setTimeout(() => setAlertMsg(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
             
             {/* --- 1. NAVBAR (Sticky & Glassmorphism) --- */}
             <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 transition-all">
                <div className="container mx-auto max-w-5xl flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group text-slate-500 hover:text-blue-600"
                        title="Kembali ke Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 tracking-tight">Bantuan & Laporan</h1>
                        <p className="text-[10px] text-slate-500 font-medium">Tiket Support</p>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                
                {/* Alert Notification */}
                {alertMsg && (
                    <div className="mb-6 animate-fade-in-down">
                        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg(null)} />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* --- 2. FORM LAPORAN (KIRI - 5 Kolom) --- */}
                    <div className="col-span-12 md:col-span-5">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                                    <Headphones size={24}/>
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-800">Buat Tiket Baru</h2>
                                    <p className="text-xs text-slate-500">Punya kendala? Kami siap membantu.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Judul Masalah</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <HelpCircle size={18} />
                                        </div>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 p-3 pl-11 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 text-sm placeholder:font-normal"
                                            placeholder="Contoh: GPS Offline / Salah Lokasi"
                                            value={form.subject}
                                            onChange={e => setForm({...form, subject: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Detail Masalah</label>
                                    <div className="relative">
                                        <div className="absolute top-3.5 left-4 pointer-events-none text-slate-400">
                                            <FileText size={18} />
                                        </div>
                                        <textarea 
                                            className="w-full bg-slate-50 border border-slate-200 p-3 pl-11 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none font-medium text-slate-700 text-sm placeholder:font-normal leading-relaxed"
                                            placeholder="Ceritakan detail kendala yang Anda alami..."
                                            value={form.message}
                                            onChange={e => setForm({...form, message: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <button 
                                    disabled={loading} 
                                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    {loading ? 'Mengirim...' : 'Kirim Tiket'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- 3. RIWAYAT LAPORAN (KANAN - 7 Kolom) --- */}
                    <div className="col-span-12 md:col-span-7 space-y-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <MessageSquare className="text-slate-400" size={20}/> Riwayat Tiket
                            </h2>
                            <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                                {reports.length} Total
                            </span>
                        </div>
                        
                        {isLoadingData ? (
                            <div className="space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                                        <div className="flex justify-between">
                                            <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
                                            <div className="h-4 bg-slate-100 rounded w-16"></div>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircleWarning size={32} className="text-slate-300" />
                                </div>
                                <h3 className="font-bold text-slate-700 text-lg">Belum ada laporan</h3>
                                <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                                    Jika Anda mengalami kendala teknis, silakan buat laporan baru di form sebelah kiri.
                                </p>
                            </div>
                        ) : (
                            reports.map(report => (
                                <div key={report.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                                    {/* HEADER TIKET (KLIK UNTUK EXPAND) */}
                                    <div 
                                        onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                        className="p-5 flex justify-between items-start cursor-pointer bg-white relative select-none"
                                    >
                                        <div className="flex gap-4">
                                            {/* Status Dot */}
                                            <div className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${
                                                report.status === 'replied' ? 'bg-green-500 shadow-green-200' : 'bg-orange-400 shadow-orange-200'
                                            }`}></div>

                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                                                    {report.subject}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium">
                                                    <span className={`px-2 py-0.5 rounded border ${
                                                        report.status === 'replied' 
                                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                                            : 'bg-orange-50 text-orange-700 border-orange-200'
                                                    } flex items-center gap-1`}>
                                                        {report.status === 'replied' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                                                        {report.status === 'replied' ? 'Dibalas' : 'Menunggu Respon'}
                                                    </span>
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-2 rounded-full transition-all text-slate-400 group-hover:bg-slate-50 ${expandedId === report.id ? 'rotate-180 text-blue-600' : ''}`}>
                                            <ChevronDown size={20}/>
                                        </div>
                                    </div>

                                    {/* DETAIL ISI & BALASAN (CHAT STYLE) */}
                                    {expandedId === report.id && (
                                        <div className="bg-slate-50 border-t border-slate-100 p-5 space-y-6 animate-fade-in text-sm">
                                            
                                            {/* 1. Chat Bubble User */}
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-500 shadow-sm">
                                                    <User size={16}/>
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm w-full max-w-[90%]">
                                                    <p className="font-bold text-slate-800 text-xs mb-1">Anda</p>
                                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{report.message}</p>
                                                </div>
                                            </div>
                                            
                                            {/* 2. Chat Bubble Admin */}
                                            {report.adminReply ? (
                                                <div className="flex gap-3 flex-row-reverse">
                                                     <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600 shadow-sm">
                                                        <Headphones size={16}/>
                                                    </div>
                                                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-md shadow-blue-200 text-white w-full max-w-[90%]">
                                                        <p className="font-bold text-blue-100 text-xs mb-1">Admin Support</p>
                                                        <p className="leading-relaxed whitespace-pre-wrap">{report.adminReply}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center">
                                                    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 text-xs font-bold shadow-sm">
                                                        <Clock size={14} className="animate-pulse"/>
                                                        Sedang ditinjau oleh Admin...
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;