import { useState, useEffect } from 'react';
import { createReport, getMyReports } from '../../services/reportService';
import { 
    MessageSquare, Send, CheckCircle, Clock, ChevronDown, ChevronUp, 
    ArrowLeft, HelpCircle, FileText, Loader2, MessageCircleWarning 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert'; // Pastikan komponen Alert diimport

const ReportPage = () => {
    const navigate = useNavigate();

    // State Data
    const [reports, setReports] = useState([]);
    const [form, setForm] = useState({ subject: '', message: '' });
    
    // State UI
    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null); // Ganti alert() biasa dengan State Alert

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
            // Auto hide alert
            setTimeout(() => setAlertMsg(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
             {/* --- 1. STICKY HEADER --- */}
             <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 flex items-center gap-3 transition-all">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                >
                    <ArrowLeft className="text-slate-500 group-hover:text-blue-600 w-6 h-6 transition-colors" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-2">
                        Bantuan & Laporan
                    </h1>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                
                {alertMsg && (
                    <div className="mb-6 animate-fade-in-down">
                        <Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg(null)} />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* --- 2. FORM LAPORAN (KIRI - 5 Kolom) --- */}
                    <div className="col-span-12 md:col-span-5">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                                    <Send size={20}/>
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800">Buat Laporan Baru</h2>
                                    <p className="text-xs text-slate-500">Jelaskan kendala Anda secara detail.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Judul Masalah</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <HelpCircle size={18} />
                                        </div>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 placeholder:font-normal"
                                            placeholder="Contoh: GPS tidak update"
                                            value={form.subject}
                                            onChange={e => setForm({...form, subject: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Detail Masalah</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                                            <FileText size={18} />
                                        </div>
                                        <textarea 
                                            className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-40 resize-none font-medium text-slate-700 placeholder:font-normal"
                                            placeholder="Ceritakan detail kendala yang Anda alami..."
                                            value={form.message}
                                            onChange={e => setForm({...form, message: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <button 
                                    disabled={loading} 
                                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                    {loading ? 'Mengirim...' : 'Kirim Laporan'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- 3. RIWAYAT LAPORAN (KANAN - 7 Kolom) --- */}
                    <div className="col-span-12 md:col-span-7 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <MessageSquare className="text-slate-400" size={20}/> Riwayat Tiket
                            </h2>
                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">
                                {reports.length}
                            </span>
                        </div>
                        
                        {isLoadingData ? (
                            <div className="space-y-3">
                                {[1,2].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircleWarning size={32} className="text-slate-300" />
                                </div>
                                <h3 className="font-bold text-slate-600">Belum ada laporan</h3>
                                <p className="text-sm text-slate-400 mt-1">Jika ada kendala, silakan buat laporan baru di form sebelah kiri.</p>
                            </div>
                        ) : (
                            reports.map(report => (
                                <div key={report.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div 
                                        onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                        className="p-5 flex justify-between items-start cursor-pointer group bg-white relative"
                                    >
                                        <div className="flex gap-4">
                                            {/* Status Icon */}
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                                report.status === 'replied' ? 'bg-green-500' : 'bg-orange-400'
                                            }`}></div>

                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                                                    {report.subject}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                                                    <span className={`px-2.5 py-1 rounded-md border ${
                                                        report.status === 'replied' 
                                                            ? 'bg-green-50 text-green-700 border-green-100' 
                                                            : 'bg-orange-50 text-orange-700 border-orange-100'
                                                    } flex items-center gap-1.5`}>
                                                        {report.status === 'replied' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                                        {report.status === 'replied' ? 'Dibalas' : 'Menunggu'}
                                                    </span>
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-2 rounded-full transition-all ${expandedId === report.id ? 'bg-slate-100 rotate-180' : 'text-slate-300'}`}>
                                            <ChevronDown size={20}/>
                                        </div>
                                    </div>

                                    {/* DETAIL ISI & BALASAN (Accordion) */}
                                    {expandedId === report.id && (
                                        <div className="bg-slate-50 border-t border-slate-100 p-5 text-sm space-y-4 animate-fade-in">
                                            {/* Pesan User */}
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                                                    <FileText size={14}/>
                                                </div>
                                                <div className="bg-white p-3.5 rounded-r-xl rounded-bl-xl border border-slate-200 shadow-sm w-full">
                                                    <p className="text-slate-700 leading-relaxed">{report.message}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Balasan Admin */}
                                            {report.adminReply ? (
                                                <div className="flex gap-3 flex-row-reverse">
                                                     <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 text-green-600">
                                                        <CheckCircle size={14}/>
                                                    </div>
                                                    <div className="bg-green-600 p-3.5 rounded-l-xl rounded-br-xl shadow-md shadow-green-200 text-white w-full">
                                                        <p className="font-bold text-green-100 text-xs mb-1">Admin Support</p>
                                                        <p className="leading-relaxed">{report.adminReply}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 text-xs font-bold">
                                                    <Clock size={16} className="animate-pulse"/>
                                                    Mohon ditunggu, tim Admin sedang meninjau laporan Anda.
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