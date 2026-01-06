import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MapPin, Shield, Smartphone, History, CheckCircle, 
    ArrowRight, Menu, X, Star, Zap 
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Data Form Order
    const [orderForm, setOrderForm] = useState({
        name: '',
        phone: '',
        address: '',
        quantity: 1
    });

    // --- HANDLER ORDER VIA WHATSAPP ---
    const handleOrderSubmit = (e) => {
        e.preventDefault();
        
        // Ganti dengan nomor WhatsApp Admin Anda (format: 628...)
        const adminNumber = "085376550460"; 
        
        const message = `Halo Admin PRATIA, saya ingin memesan GPS Tracker.%0A%0A` +
                        `Nama: ${orderForm.name}%0A` +
                        `No. HP: ${orderForm.phone}%0A` +
                        `Alamat: ${orderForm.address}%0A` +
                        `Jumlah: ${orderForm.quantity} Unit%0A%0A` +
                        `Mohon info pembayarannya. Terima kasih.`;
        
        const url = `https://wa.me/${adminNumber}?text=${message}`;
        window.open(url, '_blank');
        setIsOrderModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            
            {/* --- NAVBAR --- */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2 text-blue-600">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <MapPin size={20} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">PRATIA</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-blue-600 transition">Fitur</a>
                        <a href="#specs" className="hover:text-blue-600 transition">Spesifikasi</a>
                        <a href="#pricing" className="hover:text-blue-600 transition">Harga</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="px-4 py-2 text-slate-600 font-bold hover:text-blue-600 transition">Masuk</button>
                        <button onClick={() => navigate('/register')} className="px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-500/20">
                            Daftar Gratis
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-600">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-lg absolute w-full">
                        <a href="#features" onClick={() => setIsMenuOpen(false)} className="block font-medium text-slate-600">Fitur</a>
                        <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block font-medium text-slate-600">Harga</a>
                        <div className="pt-2 flex flex-col gap-2">
                            <button onClick={() => navigate('/login')} className="w-full py-2 border rounded-lg font-bold">Masuk</button>
                            <button onClick={() => navigate('/register')} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold">Daftar</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100 animate-fade-in-up">
                            <Zap size={14} fill="currentColor"/> Teknologi GPS Terbaru 2025
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-in-up delay-100">
                            Pantau Aset Berharga Anda <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dimanapun, Kapanpun.</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
                            Solusi pelacakan kendaraan real-time dengan akurasi tinggi. Amankan motor, mobil, dan armada bisnis Anda dalam satu genggaman aplikasi PRATIA.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                            <button 
                                onClick={() => setIsOrderModalOpen(true)}
                                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition transform hover:-translate-y-1"
                            >
                                Pesan Sekarang
                            </button>
                            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center gap-2">
                                Coba Aplikasi <ArrowRight size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-40 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            </header>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa Memilih PRATIA?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Kami menggabungkan perangkat keras tangguh dengan aplikasi yang mudah digunakan untuk keamanan maksimal.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: MapPin, title: "Lacak Real-Time", desc: "Pantau posisi kendaraan detik ini juga dengan akurasi tinggi via Google Maps." },
                            { icon: History, title: "Riwayat Perjalanan", desc: "Putar ulang rute perjalanan kendaraan hingga 90 hari ke belakang." },
                            { icon: Shield, title: "Matikan Mesin Jarak Jauh", desc: "Fitur keamanan darurat. Matikan mesin kendaraan langsung dari HP Anda." },
                            { icon: Smartphone, title: "Aplikasi Responsif", desc: "Akses mudah dari Android, iOS, maupun Laptop dengan tampilan user-friendly." },
                            { icon: Zap, title: "Notifikasi Instan", desc: "Dapatkan alert jika kendaraan keluar jalur, ngebut, atau alat dicabut paksa." },
                            { icon: CheckCircle, title: "Garansi Resmi", desc: "Layanan purna jual terbaik dengan garansi ganti baru jika alat rusak." },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PRICING CTA --- */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Amankan Aset Anda Hari Ini</h2>
                            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                                Jangan tunggu sampai kejadian buruk menimpa. Investasi kecil untuk keamanan jangka panjang.
                            </p>
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-4xl font-bold text-white mb-2">Rp 499.000 <span className="text-lg text-slate-400 font-normal">/ unit</span></div>
                                <div className="text-sm text-slate-400 mb-6">Termasuk Pemasangan & Kartu Data 1 Bulan</div>
                                <button 
                                    onClick={() => setIsOrderModalOpen(true)}
                                    className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 shadow-xl shadow-blue-500/50 transition transform hover:scale-105"
                                >
                                    Pesan via WhatsApp
                                </button>
                            </div>
                        </div>
                        
                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-slate-100 py-12">
                <div className="container mx-auto px-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 mb-2">
                                <MapPin size={24} />
                                <span className="font-bold text-xl text-slate-900">PRATIA</span>
                            </div>
                            <p className="text-slate-500 text-sm">© 2024 Pratia GPS System. All rights reserved.</p>
                        </div>
                        <div className="flex gap-6 text-sm font-bold text-slate-600">
                            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600">Terms of Service</a>
                            <a href="#" className="hover:text-blue-600">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* --- MODAL ORDER (POPUP) --- */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setIsOrderModalOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Form Pemesanan</h2>
                        <p className="text-sm text-slate-500 mb-6">Isi data di bawah, kami akan alihkan ke WhatsApp Admin.</p>
                        
                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Lengkap</label>
                                <input 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Nama Anda"
                                    required
                                    value={orderForm.name}
                                    onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nomor WhatsApp</label>
                                <input 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0812..."
                                    type="tel"
                                    required
                                    value={orderForm.phone}
                                    onChange={e => setOrderForm({...orderForm, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Alamat Pemasangan</label>
                                <textarea 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                    placeholder="Kota / Alamat lengkap..."
                                    required
                                    value={orderForm.address}
                                    onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Jumlah Unit</label>
                                <input 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    type="number"
                                    min="1"
                                    value={orderForm.quantity}
                                    onChange={e => setOrderForm({...orderForm, quantity: e.target.value})}
                                />
                            </div>
                            
                            <button type="submit" className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/20 active:scale-95 transition-all mt-2 flex items-center justify-center gap-2">
                                <Smartphone size={18} /> Kirim ke WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LandingPage;