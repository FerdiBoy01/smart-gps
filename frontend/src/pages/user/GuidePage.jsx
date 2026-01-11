import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, BookOpen, Smartphone, HardDrive, ChevronDown, 
    Zap, MapPin, History, Bell, LifeBuoy, FileText
} from 'lucide-react';

const GuidePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('app'); // 'app' or 'device'
    const [openIndex, setOpenIndex] = useState(null);

    // DATA PANDUAN APLIKASI
    const appGuides = [
        {
            title: "Melacak Kendaraan Real-time",
            icon: MapPin,
            content: "Masuk ke Dashboard utama, lalu klik tombol **'Lacak Lokasi'** pada kartu kendaraan yang ingin Anda pantau. Anda akan diarahkan ke peta interaktif. Posisi kendaraan diperbarui otomatis setiap 10-30 detik saat bergerak."
        },
        {
            title: "Melihat Riwayat Perjalanan (Playback)",
            icon: History,
            content: "Buka detail kendaraan, lalu pilih menu **'History'**. Tentukan rentang tanggal dan waktu yang diinginkan, kemudian tekan tombol **Putar**. Anda dapat melihat animasi rute yang telah dilalui kendaraan."
        },
        {
            title: "Mematikan Mesin Jarak Jauh",
            icon: Zap,
            content: "Fitur ini membutuhkan instalasi Relay (Cut Engine). Di halaman detail kendaraan, tekan tombol **Power/Matikan Mesin**. Masukkan password akun Anda untuk konfirmasi. \n\n⚠️ *Penting: Mesin hanya akan mati saat kecepatan kendaraan di bawah 20 km/jam demi keselamatan.*"
        },
        {
            title: "Notifikasi Speeding & Geofence",
            icon: Bell,
            content: "Anda dapat menerima alert jika kendaraan melaju melebihi batas kecepatan atau keluar dari area yang ditentukan. Pengaturan ini dapat diakses melalui menu **Settings > Notifikasi** pada detail kendaraan masing-masing."
        }
    ];

    // DATA PANDUAN PERANGKAT (HARDWARE)
    const deviceGuides = [
        {
            title: "Instalasi Kartu SIM GPS",
            icon: Smartphone,
            content: "1. Pastikan alat GPS dalam kondisi **MATI** (cabut soket baterai/kabel power).\n2. Siapkan kartu SIM ukuran yang sesuai (Micro/Nano) yang sudah memiliki **kuota internet aktif**.\n3. Masukkan kartu ke slot SIM hingga terdengar bunyi 'klik'.\n4. Sambungkan kembali power untuk menyalakan alat."
        },
        {
            title: "Arti Indikator Lampu LED",
            icon: Zap,
            content: "• 🔴 **LED Merah (Power):** Menyala diam = Mengisi daya/Standby. Mati = Baterai penuh/habis.\n• 🟡 **LED Kuning (GSM):** Berkedip cepat = Mencari sinyal. Berkedip lambat = Sinyal stabil.\n• 🔵 **LED Biru (GPS):** Berkedip = Mendapatkan lokasi satelit (GPS Lock)."
        },
        {
            title: "Skema Kabel Kelistrikan",
            icon: HardDrive,
            content: "• **Kabel Merah:** Sambungkan ke Kutub Positif (+) Aki (12V-24V) -> Arus Standby.\n• **Kabel Hitam:** Sambungkan ke Kutub Negatif (-) Aki atau Baut Body (Massa).\n• **Kabel Oranye (ACC):** Sambungkan ke kabel kontak ON untuk mendeteksi status mesin hidup/mati."
        },
        {
            title: "Mengatasi GPS Offline / Tidak Update",
            icon: BookOpen,
            content: "Jika status di aplikasi 'Offline', periksa hal berikut:\n1. Pastikan kartu SIM memiliki kuota internet dan masa aktif.\n2. Pastikan kendaraan berada di area terbuka (tidak di basement/gedung beton tebal).\n3. Cek sekring dan sambungan kabel power ke aki."
        }
    ];

    const currentGuides = activeTab === 'app' ? appGuides : deviceGuides;

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            
            {/* --- NAVBAR --- */}
            <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 transition-all">
                <div className="container mx-auto max-w-3xl flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group text-slate-500 hover:text-blue-600"
                        title="Kembali"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 tracking-tight">Pusat Bantuan</h1>
                        <p className="text-[10px] text-slate-500 font-medium">Panduan & FAQ</p>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                
                {/* --- HEADER BANNER --- */}
                <div className="bg-white rounded-3xl p-8 mb-8 text-center border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-sm">
                            <LifeBuoy size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Butuh Bantuan?</h2>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            Temukan jawaban cepat tentang cara menggunakan aplikasi SmartGPS dan panduan teknis pemasangan alat.
                        </p>
                    </div>
                    
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
                </div>

                {/* --- TABS NAVIGATION --- */}
                <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 mb-6">
                    <button 
                        onClick={() => { setActiveTab('app'); setOpenIndex(null); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'app' 
                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <Smartphone size={18} /> Aplikasi
                    </button>
                    <button 
                        onClick={() => { setActiveTab('device'); setOpenIndex(null); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'device' 
                            ? 'bg-white text-orange-600 shadow-sm ring-1 ring-black/5' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <HardDrive size={18} /> Hardware
                    </button>
                </div>

                {/* --- ACCORDION LIST --- */}
                <div className="space-y-3">
                    {currentGuides.map((guide, index) => (
                        <div 
                            key={index} 
                            className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
                                openIndex === index 
                                ? 'border-blue-200 shadow-md ring-1 ring-blue-100' 
                                : 'border-slate-200 shadow-sm hover:border-blue-200'
                            }`}
                        >
                            <button 
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                                        openIndex === index 
                                        ? (activeTab === 'app' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600')
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                                    }`}>
                                        <guide.icon size={20} />
                                    </div>
                                    <span className={`font-bold text-sm md:text-base pr-4 ${openIndex === index ? 'text-slate-800' : 'text-slate-600'}`}>
                                        {guide.title}
                                    </span>
                                </div>
                                <ChevronDown 
                                    size={20} 
                                    className={`text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-blue-600' : ''}`}
                                />
                            </button>
                            
                            {/* CONTENT WITH ANIMATION LOGIC */}
                            <div 
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-5 pb-6 pt-0 pl-[72px]"> {/* Indent to align with text */}
                                    <div className="prose prose-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {guide.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- CONTACT SUPPORT --- */}
                <div className="mt-10 border-t border-slate-200 pt-8 text-center">
                    <p className="text-slate-900 font-bold mb-1">Tidak menemukan jawaban?</p>
                    <p className="text-slate-500 text-sm mb-4">Tim teknis kami siap membantu menyelesaikan kendala Anda.</p>
                    <button 
                        onClick={() => navigate('/reports')}
                        className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                        <FileText size={16} /> Buat Tiket Bantuan
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GuidePage;