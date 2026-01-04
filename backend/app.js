const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import Model & Relasi
require('./models'); 

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const deviceRoutes = require('./routes/deviceRoutes'); // <--- 1. WAJIB ADA

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- DAFTARKAN ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devices', deviceRoutes); // <--- 2. WAJIB ADA (Penyebab 404 kalau hilang)

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database terhubung.');
        app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
    })
    .catch(err => console.error('Gagal konek DB:', err));