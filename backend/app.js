const express = require('express');
const cors = require('cors');
const path = require('path');
const { Op } = require('sequelize'); // <--- 1. Import Operator Sequelize
const sequelize = require('./config/database');
const startQuotaChecker = require('./utils/cronJobs');

// Import Model & Relasi
// Kita butuh 'Device' untuk mengubah status offline
const { Device } = require('./models'); 

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const gpsRoutes = require('./routes/gpsRoutes'); 
const reportRoutes = require('./routes/reportRoutes');
const landingRoutes = require('./routes/landingRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CONFIG CORS
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan port frontend
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. STATIC FOLDER (Agar gambar produk bisa dibuka)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DAFTARKAN ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devices', deviceRoutes); 
app.use('/api/gps', gpsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/landing-content', landingRoutes);
app.use('/api/products', productRoutes);

// 3. JALANKAN CRON JOB (Quota Checker)
startQuotaChecker();

// 4. SATPAM OTOMATIS (AUTO OFFLINE CHECKER) - INI SOLUSI BUG ANDA
// Fungsi ini berjalan setiap 30 detik
setInterval(async () => {
    try {
        // Kita set batas waktu toleransi: 1 Menit yang lalu
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000); 
        
        // LOG 1: Cek Jam Server
        // console.log("🕒 Server Time:", new Date().toLocaleString(), "| Batas Offline:", oneMinuteAgo.toLocaleString());

        // Update database: Cari yang ONLINE tapi lastActive-nya < 1 menit lalu
        const [updatedCount] = await Device.update(
            { status: 'offline' }, 
            {
                where: {
                    status: 'online',
                    lastActive: {
                        [Op.lt]: oneMinuteAgo 
                    }
                }
            }
        );

        if (updatedCount > 0) {
            console.log(`✅ BERHASIL: ${updatedCount} device dipaksa OFFLINE.`);
        } else {
            // Jika kamu mau lihat log detail kenapa TIDAK ada yang berubah, buka komen di bawah ini:
            /*
            const onlineDevs = await Device.findAll({ where: { status: 'online' }, attributes: ['name', 'lastActive'] });
            if (onlineDevs.length > 0) {
                console.log("⚠️ Device masih Online:", onlineDevs.map(d => `${d.name} (${new Date(d.lastActive).toLocaleTimeString()})`));
            }
            */
        }

    } catch (error) {
        console.error("Error Auto-Offline:", error.message);
    }
}, 10000); // Cek tiap 10 detik biar cepat ketahuan
// 5. START SERVER
// Gunakan { alter: true } agar tabel diupdate jika ada perubahan kolom baru, tanpa menghapus data lama.
sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('>>> DATABASE KONEK & SIAP <<<');
        app.listen(PORT, '0.0.0.0', () => console.log(`Server jalan di port ${PORT}`));
    })
    .catch(err => {
        console.error('Gagal konek DB:', err);
    });