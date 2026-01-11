const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const startQuotaChecker = require('./utils/cronJobs');
const path = require('path');

// Import Model & Relasi
require('./models'); 

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

// 1. CONFIG CORS YANG LEBIH KUAT
// Izinkan Frontend (localhost:5173) mengakses Backend
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan port frontend kamu
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DAFTARKAN ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devices', deviceRoutes); 
app.use('/api/gps', gpsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/landing-content', landingRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JALANKAN CRON JOB
startQuotaChecker();


// 2. RESET DATABASE (FORCE: TRUE)
// Gunakan ini SEKALI SAJA untuk membersihkan error "Too many keys"
sequelize.sync() 
    .then(() => {
        console.log('>>> DATABASE BERHASIL DI-RESET & KONEK <<<');
        app.listen(PORT, '0.0.0.0', () => console.log(`Server jalan di port ${PORT}`));
    })
    .catch(err => {
        console.error('Gagal konek DB:', err);
    });