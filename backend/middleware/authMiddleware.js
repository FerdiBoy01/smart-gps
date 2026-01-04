const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Cek apakah user punya Token (Sudah login?)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN_DISINI"

    if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
        req.user = user; // Simpan data user (id, role) ke request
        next();
    });
};

// 2. Cek apakah user adalah ADMIN
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses terlarang! Halaman ini khusus Admin.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };