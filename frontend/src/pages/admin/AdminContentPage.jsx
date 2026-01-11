import { useState, useEffect } from 'react';
import { getLandingContent, updateLandingContent } from '../../services/landingService';
import { Save, Loader2, LayoutTemplate, Smartphone, DollarSign, Type } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminContentPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);
    
    // State Form yang sesuai dengan Database
    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        adminPhone: '',
        price: '',
        features: [] 
    });

    // Load data saat halaman dibuka
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getLandingContent();
            setFormData({
                heroTitle: data.heroTitle || '',
                heroSubtitle: data.heroSubtitle || '',
                adminPhone: data.adminPhone || '',
                price: data.price || '',
                features: data.features || []
            });
        } catch (error) {
            setAlertMsg({ type: 'error', message: 'Gagal mengambil data konten.' });
        } finally {
            setLoading(false);
        }
    };

    // Handler untuk edit fitur (karena bentuknya Array JSON)
    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index][field] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlertMsg(null);
        try {
            await updateLandingContent(formData);
            setAlertMsg({ type: 'success', message: 'Halaman depan berhasil diperbarui!' });
        } catch (error) {
            setAlertMsg({ type: 'error', message: 'Gagal menyimpan perubahan.' });
        } finally {
            setSaving(false);
            setTimeout(() => setAlertMsg(null), 3000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96 text-slate-500">
            <Loader2 className="animate-spin mr-2"/> Memuat editor...
        </div>
    );

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <LayoutTemplate className="text-blue-600"/> Editor Landing Page
                    </h1>
                    <p className="text-slate-500 text-sm">Ubah tampilan website utama secara real-time.</p>
                </div>
            </div>

            {alertMsg && <div className="mb-6"><Alert type={alertMsg.type} message={alertMsg.message} onClose={() => setAlertMsg(null)} /></div>}

            <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
                
                {/* SECTION 1: HERO (ATAS) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold border-b pb-2">
                        <Type size={20}/> <h3>Hero Section (Tampilan Utama)</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul Besar (Headline)</label>
                            <input 
                                value={formData.heroTitle}
                                onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                                placeholder="Contoh: Pantau Aset Anda..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sub-Judul (Deskripsi)</label>
                            <textarea 
                                value={formData.heroSubtitle}
                                onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                placeholder="Deskripsi singkat di bawah judul..."
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: KONTAK & HARGA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-green-600 font-bold border-b pb-2">
                            <Smartphone size={20}/> <h3>Kontak WhatsApp</h3>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nomor Admin (Format: 628...)</label>
                            <input 
                                type="number"
                                value={formData.adminPhone}
                                onChange={e => setFormData({...formData, adminPhone: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono"
                                placeholder="628123456789"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">*Gunakan kode negara (62) tanpa tanda plus (+).</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold border-b pb-2">
                            <DollarSign size={20}/> <h3>Harga Produk</h3>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga Satuan (Rp)</label>
                            <input 
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-lg"
                                placeholder="499.000"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: FITUR (JSON ARRAY) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold border-b pb-2">
                        <LayoutTemplate size={20}/> <h3>Daftar Fitur Unggulan</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.features.map((feat, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group hover:border-blue-300 transition-colors">
                                <span className="absolute top-2 right-3 text-[10px] font-bold text-slate-300">#{idx + 1}</span>
                                <div className="space-y-3">
                                    <input 
                                        value={feat.title}
                                        onChange={e => handleFeatureChange(idx, 'title', e.target.value)}
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Judul Fitur"
                                    />
                                    <textarea 
                                        value={feat.desc}
                                        onChange={e => handleFeatureChange(idx, 'desc', e.target.value)}
                                        className="w-full p-2 border border-slate-200 rounded-lg text-xs h-20 resize-none focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Deskripsi Fitur"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-4 italic">*Ikon fitur diatur otomatis oleh sistem berdasarkan urutan.</p>
                </div>

                {/* FAB SAVE BUTTON */}
                <div className="fixed bottom-6 right-6 z-40">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-4 rounded-full font-bold shadow-xl shadow-blue-500/40 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save />} 
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminContentPage;