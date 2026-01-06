import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, BookOpen, Smartphone, HardDrive, ChevronDown, 
    ChevronUp, Zap, MapPin, History, Bell 
} from 'lucide-react';

const GuidePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('app'); // 'app' or 'device'
    const [openIndex, setOpenIndex] = useState(null);

    // DATA PANDUAN APLIKASI
    const appGuides = [
        {
            title: "Bagaimana cara melacak kendaraan secara Real-time?",
            icon: MapPin,
            content: "Masuk ke Dashboard, lalu klik pada kartu kendaraan yang ingin Anda pantau. Anda akan diarahkan ke halaman Peta. Posisi kendaraan akan diperbarui otomatis setiap 10-30 detik tergantung sinyal."
        },
        {
            title: "Bagaimana cara melihat Riwayat Perjalanan (Playback)?",
            icon: History,
            content: "Pada halaman Detail Kendaraan, klik menu 'History' atau 'Riwayat'. Pilih rentang tanggal dan jam yang diinginkan, lalu klik tombol 'Putar' untuk melihat animasi pergerakan kendaraan."
        },
        {
            title: "Bagaimana cara mematikan mesin jarak jauh?",
            icon: Zap,
            content: "Fitur ini hanya bekerja jika Relay terpasang. Di halaman Detail Kendaraan, cari tombol 'Matikan Mesin' (ikon Petir/Power). Masukkan password akun Anda untuk konfirmasi keamanan. Mesin akan mati saat kecepatan kendaraan di bawah 20km/jam demi keselamatan."
        },
        {
            title: "Mengatur Notifikasi (Speeding & Geofence)",
            icon: Bell,
            content: "Masuk ke menu Pengaturan > Notifikasi. Anda bisa mengaktifkan alert untuk batas kecepatan (Speeding) atau area terlarang (Geofence). Notifikasi akan muncul di HP Anda."
        }
    ];

    // DATA PANDUAN PERANGKAT (HARDWARE)
    const deviceGuides = [
        {
            title: "Cara Memasang Kartu SIM",
            icon: Smartphone,
            content: "1. Pastikan alat GPS dalam kondisi mati (baterai dicabut jika ada).\n2. Siapkan kartu SIM ukuran Micro/Nano (sesuai tipe alat) yang sudah ada kuota internet dan pulsa.\n3. Masukkan ke slot SIM hingga berbunyi 'klik'.\n4. Nyalakan alat."
        },
        {
            title: "Arti Lampu Indikator LED",
            icon: Zap,
            content: "• LED Merah (Power): Menyala diam berarti sedang mengisi daya, mati berarti baterai penuh/kosong.\n• LED Kuning (GSM/Sinyal): Berkedip cepat berarti mencari sinyal, berkedip lambat berarti sinyal stabil.\n• LED Biru (GPS): Berkedip berarti sudah mengunci lokasi satelit."
        },
        {
            title: "Skema Kabel (Pemasangan ke Aki)",
            icon: HardDrive,
            content: "• Kabel Merah: Sambungkan ke Kutub Positif (+) Aki (12V-24V).\n• Kabel Hitam: Sambungkan ke Kutub Negatif (-) Aki / Massa Body.\n• Kabel Oranye (ACC): Sambungkan ke kabel kontak ON (untuk deteksi mesin hidup)."
        },
        {
            title: "Perangkat Offline / Tidak Update",
            icon: BookOpen,
            content: "Jika status Offline, cek hal berikut:\n1. Pastikan kartu SIM masih ada kuota dan masa aktif.\n2. Pastikan kendaraan tidak di dalam gedung tertutup/basement (GPS butuh langit terbuka).\n3. Cek apakah kabel power terlepas dari aki."
        }
    ];

    const currentGuides = activeTab === 'app' ? appGuides : deviceGuides;

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* STICKY NAVBAR */}
            <nav className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm border-b sticky top-0 z-30 flex items-center gap-3 transition-all">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                >
                    <ArrowLeft className="text-slate-500 group-hover:text-blue-600 w-6 h-6 transition-colors" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-2">
                        Panduan Penggunaan
                    </h1>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-6 max-w-3xl">
                
                {/* HEADER TEXT */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Pusat Bantuan</h2>
                    <p className="text-slate-500 mt-2">Temukan jawaban cara menggunakan Aplikasi dan Alat GPS.</p>
                </div>

                {/* TABS KATEGORI */}
                <div className="bg-white p-1.5 rounded-xl border border-slate-200 flex gap-2 mb-8 shadow-sm">
                    <button 
                        onClick={() => { setActiveTab('app'); setOpenIndex(null); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'app' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Smartphone size={18} /> Aplikasi
                    </button>
                    <button 
                        onClick={() => { setActiveTab('device'); setOpenIndex(null); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'device' 
                            ? 'bg-orange-500 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <HardDrive size={18} /> Perangkat GPS
                    </button>
                </div>

                {/* LIST PANDUAN (ACCORDION) */}
                <div className="space-y-4">
                    {currentGuides.map((guide, index) => (
                        <div 
                            key={index} 
                            className={`bg-white border transition-all rounded-xl overflow-hidden ${
                                openIndex === index ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-slate-200 shadow-sm'
                            }`}
                        >
                            <button 
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg shrink-0 ${openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <guide.icon size={20} />
                                    </div>
                                    <span className={`font-bold text-sm md:text-base ${openIndex === index ? 'text-slate-800' : 'text-slate-600'}`}>
                                        {guide.title}
                                    </span>
                                </div>
                                {openIndex === index ? <ChevronUp className="text-blue-500"/> : <ChevronDown className="text-slate-400"/>}
                            </button>
                            
                            {/* CONTENT */}
                            {openIndex === index && (
                                <div className="px-5 pb-5 pt-0 bg-white animate-fade-in">
                                    <div className="pl-[52px]"> {/* Indentasi sejajar teks judul */}
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                            {guide.content}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* FOOTER CONTACT */}
                <div className="mt-12 text-center bg-slate-100 rounded-2xl p-6">
                    <p className="text-slate-500 text-sm font-bold mb-1">Masih butuh bantuan?</p>
                    <p className="text-slate-400 text-xs mb-4">Tim support kami siap membantu Anda.</p>
                    <button 
                        onClick={() => navigate('/reports')}
                        className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                        Hubungi Kami
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GuidePage;