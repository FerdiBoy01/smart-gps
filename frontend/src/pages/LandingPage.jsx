import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // IMPORT FRAMER MOTION
import { getLandingContent } from '../services/landingService';
import { getProducts } from '../services/productService';
import { 
    MapPin, Shield, Smartphone, History, CheckCircle, 
    ArrowRight, Menu, X, Zap, Loader2, ShoppingBag, 
    Star, Users, HelpCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    
    // --- STATE ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [content, setContent] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    // Form Order State
    const [orderForm, setOrderForm] = useState({
        name: '', phone: '', address: '', quantity: 1, productName: 'GPS Tracker Basic'
    });

    // --- EFFECT ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [landingData, productData] = await Promise.all([
                    getLandingContent(),
                    getProducts()
                ]);
                setContent(landingData);
                setProducts(productData);
            } catch (error) {
                console.error("Gagal load data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- HELPER ---
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    const handleOrderClick = (productName) => {
        setOrderForm(prev => ({ ...prev, productName: productName || 'Produk Umum' }));
        setIsOrderModalOpen(true);
    };
    const handleOrderSubmit = (e) => {
        e.preventDefault();
        const adminNumber = content?.adminPhone || "6285376550460"; 
        const message = `Halo Admin PRATIA, saya mau pesan:%0A%0A📦 *Produk:* ${orderForm.productName}%0A👤 *Nama:* ${orderForm.name}%0A📱 *HP:* ${orderForm.phone}%0A📍 *Alamat:* ${orderForm.address}%0A🔢 *Jml:* ${orderForm.quantity}%0A%0AMohon infonya.`;
        window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
        setIsOrderModalOpen(false);
    };
    const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

    // --- ANIMATION VARIANTS (Framer Motion Config) ---
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 } // Jeda antar elemen
        }
    };
    const cardHover = {
        hover: { y: -8, transition: { type: "spring", stiffness: 300 } }
    };

    // --- DATA ---
    const stats = [
        { label: "Pengguna Aktif", value: "1,200+", icon: Users },
        { label: "Kota Terjangkau", value: "50+", icon: MapPin },
        { label: "Rating Kepuasan", value: "4.9/5", icon: Star },
    ];
    const faqs = [
        { q: "Apakah GPS ini bisa mematikan mesin jarak jauh?", a: "Ya, fitur Cut-Off engine tersedia di aplikasi PRATIA dan bisa diakses kapan saja." },
        { q: "Apakah ada biaya langganan bulanan?", a: "Kami menyediakan paket server gratis 1 tahun pertama. Setelah itu biaya perpanjangan sangat terjangkau." },
        { q: "Bagaimana cara pemasangannya?", a: "Kami memiliki teknisi rekanan di berbagai kota, atau panduan lengkap untuk bengkel langganan Anda." },
    ];

    // --- RENDER LOADING ---
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-blue-600 gap-4">
            <Loader2 size={48} className="animate-spin text-blue-600/80" />
        </div>
    );

    const displayContent = content || { heroTitle: "Loading...", heroSubtitle: "", price: "0", features: [] };
    const featureIcons = [MapPin, History, Shield, Smartphone, Zap, CheckCircle];

    return (
        // Background gradient halus agar tidak terlihat flat white
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
            
            {/* 1. NAVBAR (Sticky & Glass Effect) */}
            <motion.nav 
                initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
                className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'}`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-600 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                        {/* Logo dengan gradient halus */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
                            <MapPin size={22} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">PRATIA</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#features" className="hover:text-blue-600 transition">Fitur</a>
                        <a href="#catalog" className="hover:text-blue-600 transition">Produk</a>
                        <a href="#faq" className="hover:text-blue-600 transition">Bantuan</a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-slate-700 font-semibold hover:bg-slate-100 rounded-full transition">Masuk</button>
                        {/* Tombol dengan gradient */}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-md hover:shadow-xl shadow-blue-500/30 transition">
                            Daftar Gratis
                        </motion.button>
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-800">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
                {/* Mobile Menu Animation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 space-y-4 shadow-xl absolute w-full"
                        >
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block font-semibold text-slate-600 py-2">Fitur Unggulan</a>
                            <a href="#catalog" onClick={() => setIsMenuOpen(false)} className="block font-semibold text-slate-600 py-2">Katalog Produk</a>
                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                <button onClick={() => navigate('/login')} className="py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50">Masuk</button>
                                <button onClick={() => navigate('/register')} className="py-3 bg-blue-600 text-white rounded-xl font-bold">Daftar</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* 2. HERO SECTION (Animated Entrance) */}
            <header className="relative pt-36 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 text-blue-700 text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100/50 backdrop-blur-sm">
                            <Star size={14} fill="currentColor" className="text-yellow-400"/> Solusi Keamanan #1 Indonesia
                        </motion.div>
                        
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tight">
                            {displayContent.heroTitle}
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            {displayContent.heroSubtitle}
                        </motion.p>
                        
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleOrderClick('Konsultasi Gratis')}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/30 transition"
                            >
                                Pesan Sekarang
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-blue-200 transition flex items-center justify-center gap-2 group">
                                Coba Aplikasi <ArrowRight size={20} className="group-hover:translate-x-1 transition"/>
                            </motion.button>
                        </motion.div>

                        {/* Stats Row Animated */}
                        <motion.div variants={fadeInUp} className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-slate-100/50 pt-10">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/50 transition">
                                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-2xl md:text-3xl">
                                        <stat.icon className="text-blue-500 w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" /> {stat.value}
                                    </div>
                                    <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Background Decor (Lebih halus) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob"></div>
                    <div className="absolute top-[10%] right-[-20%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
                </div>
            </header>

            {/* 3. FEATURES (Staggered Card Animation) */}
            <section id="features" className="py-24 relative z-10">
                <div className="container mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Canggih untuk Ketenangan Anda</h2>
                        <p className="text-slate-500 text-lg font-medium">Semua yang Anda butuhkan untuk memantau kendaraan dalam satu aplikasi.</p>
                    </motion.div>

                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {displayContent.features && displayContent.features.map((feature, idx) => {
                            const IconComponent = featureIcons[idx] || CheckCircle;
                            return (
                                <motion.div 
                                    key={idx} variants={fadeInUp} whileHover="hover"
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100/80 hover:border-blue-200/50 shadow-sm hover:shadow-xl shadow-blue-500/5 transition-all duration-300 group"
                                >
                                    <motion.div variants={cardHover} className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                        <IconComponent size={28} strokeWidth={1.5} className="drop-shadow-sm"/>
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* 4. CATALOG PRODUCT (Staggered & Hover Lift) */}
            <section id="catalog" className="py-24 relative bg-white">
                {/* Divider halus di atas */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-white pointer-events-none"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Katalog Resmi</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Pilih Perangkat Anda</h2>
                        </div>
                        <button onClick={() => handleOrderClick('Konsultasi Produk')} className="text-slate-500 hover:text-blue-600 font-bold flex items-center gap-2 transition group">
                            Konsultasi Dulu <ArrowRight size={18} className="group-hover:translate-x-1 transition"/>
                        </button>
                    </motion.div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-400 font-medium">Belum ada produk yang ditampilkan.</p>
                        </div>
                    ) : (
                        <motion.div 
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {products.map((product) => (
                                <motion.div 
                                    key={product.id} variants={fadeInUp} whileHover="hover"
                                    className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full"
                                >
                                    <motion.div variants={cardHover} className="relative h-64 overflow-hidden bg-slate-50">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-slate-700 shadow-sm">
                                            {product.category}
                                        </div>
                                    </motion.div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 font-medium">{product.description}</p>
                                        
                                        <div className="pt-5 border-t border-dashed border-slate-100 flex items-center justify-between mt-auto">
                                            <div className="text-slate-900 font-extrabold text-lg">{formatRupiah(product.price)}</div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1, backgroundColor: "#2563eb" }} whileTap={{ scale: 0.9 }}
                                                onClick={() => handleOrderClick(product.name)}
                                                className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg shadow-slate-900/20"
                                            >
                                                <ShoppingBag size={18}/>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 5. FAQ SECTION (Smooth Accordion) */}
            <section id="faq" className="py-24 bg-slate-50 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Sering Ditanyakan</h2>
                        <p className="text-slate-500 font-medium">Jawaban cepat untuk pertanyaan umum Anda.</p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-blue-300/50 transition-colors shadow-sm hover:shadow-md">
                                <button 
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                >
                                    <span className="font-bold text-slate-800 text-lg flex items-center gap-4">
                                        <HelpCircle size={22} className="text-blue-500/80" /> {faq.q}
                                    </span>
                                    <motion.div animate={{ rotate: openFaqIndex === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                        <ChevronDown className={`text-slate-400 ${openFaqIndex === idx ? 'text-blue-600' : ''}`}/>
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === idx && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-8 text-slate-500 leading-relaxed font-medium pl-16">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 6. CTA FOOTER (Modern Dark Theme) */}
            <section className="py-24 relative overflow-hidden bg-[#0f172a]">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Siap Mengamankan Aset Anda?</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        Bergabunglah dengan ribuan pengguna lain yang telah mempercayakan keamanan kendaraannya pada PRATIA.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrderClick('Paket Lengkap Website')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/20"
                        >
                            Hubungi Sales Kami
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')} className="px-8 py-4 bg-transparent border-2 border-slate-700 text-white rounded-full font-bold text-lg transition">
                            Daftar Akun Demo
                        </motion.button>
                    </div>
                </motion.div>
                {/* Subtle Dark Gradient Mesh */}
                <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f172a] to-[#0f172a]"></div>
            </section>

            {/* 7. FOOTER */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 mb-2">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-500 p-1.5 rounded-lg text-white shadow-md">
                                    <MapPin size={18} fill="currentColor"/>
                                </div>
                                <span className="font-bold text-xl text-slate-900 tracking-tight">PRATIA</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">© 2024 Pratia GPS System. All rights reserved.</p>
                        </div>
                        <div className="flex gap-8 text-sm font-semibold text-slate-600">
                            <a href="#" className="hover:text-blue-600 transition">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-blue-600 transition">Syarat & Ketentuan</a>
                            <a href="#" className="hover:text-blue-600 transition">Kontak</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* --- MODAL ORDER (Animated Popup) --- */}
            <AnimatePresence>
                {isOrderModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            {/* Header Modal */}
                            <div className="bg-slate-50/80 p-6 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">Form Pemesanan</h3>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mt-1">{orderForm.productName}</p>
                                </div>
                                <button onClick={() => setIsOrderModalOpen(false)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleOrderSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Nama Lengkap</label>
                                    <input className="w-full bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-400" 
                                        placeholder="Contoh: Budi Santoso" required value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">WhatsApp</label>
                                    <input className="w-full bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-400" 
                                        placeholder="0812..." type="tel" required value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Alamat</label>
                                    <textarea className="w-full bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all h-24 resize-none font-medium placeholder:text-slate-400" 
                                        placeholder="Alamat lengkap pengiriman..." required value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Jumlah</label>
                                        <input className="w-full bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-bold text-center" 
                                            type="number" min="1" value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: e.target.value})} />
                                    </div>
                                    <div className="flex items-end">
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                                            <Smartphone size={20} /> Kirim WA
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;