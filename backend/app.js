const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// Import Model agar tabel dibuat otomatis saat start
require('./models/User');
require('./models/Otp');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Jalankan Server & DB
sequelize.sync({ alter: true }) // 'alter: true' update struktur tabel jika ada perubahan
    .then(() => {
        console.log('Database terhubung & tersinkronisasi.');
        app.listen(PORT, () => {
            console.log(`Server bisnis berjalan di port ${PORT}`);
        });
    })
    .catch(err => console.error('Gagal koneksi database:', err));