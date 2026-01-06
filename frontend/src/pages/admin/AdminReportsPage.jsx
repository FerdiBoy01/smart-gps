import { useState, useEffect } from 'react';
import { getAllReports, replyReport } from '../../services/reportService';
import { MessageSquare, User, CheckCircle, Send } from 'lucide-react';

const AdminReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const data = await getAllReports();
            setReports(data);
        } catch (error) { console.error(error); }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!selectedReport) return;
        
        try {
            await replyReport(selectedReport.id, replyText);
            alert("Balasan terkirim!");
            setReplyText("");
            setSelectedReport(null);
            loadData(); // Refresh list
        } catch (error) {
            alert("Gagal mengirim balasan.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Laporan Masalah User</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LIST LAPORAN (KIRI) */}
                <div className="lg:col-span-2 space-y-4">
                    {reports.map(report => (
                        <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                                        <User size={18}/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{report.reporter?.username || 'Unknown'}</p>
                                        <p className="text-xs text-slate-400">{report.reporter?.email}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                                    report.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {report.status}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-slate-800 mt-2">{report.subject}</h3>
                            <p className="text-slate-600 text-sm mt-1 bg-slate-50 p-3 rounded-lg">"{report.message}"</p>

                            {report.adminReply && (
                                <div className="mt-3 ml-4 pl-4 border-l-2 border-green-300">
                                    <p className="text-xs font-bold text-green-600 mb-1">Balasan Anda:</p>
                                    <p className="text-sm text-slate-700">{report.adminReply}</p>
                                </div>
                            )}

                            {report.status === 'pending' && (
                                <button 
                                    onClick={() => setSelectedReport(report)}
                                    className="mt-3 text-sm text-blue-600 font-bold hover:underline flex items-center gap-1"
                                >
                                    <MessageSquare size={14}/> Balas Laporan Ini
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* FORM BALASAN (KANAN - STICKY) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-6">
                        <h2 className="font-bold text-lg mb-4">Balas Laporan</h2>
                        
                        {selectedReport ? (
                            <form onSubmit={handleReply}>
                                <div className="mb-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                                    Membalas: <b>{selectedReport.subject}</b>
                                    <br/>oleh {selectedReport.reporter?.username}
                                </div>
                                <textarea 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 h-32 text-sm"
                                    placeholder="Tulis balasan untuk user..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    required
                                />
                                <div className="flex gap-2 mt-3">
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700">
                                        Kirim Balasan
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedReport(null)}
                                        className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <MessageSquare size={40} className="mx-auto mb-2 opacity-30"/>
                                <p className="text-sm">Pilih laporan di kiri yang berstatus "Pending" untuk membalas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;