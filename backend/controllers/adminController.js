const User = require('../models/User');
const bcrypt = require('bcrypt');

// Ambil Semua User (Kecuali Password)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hapus User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 1. CREATE USER
exports.createUser = async (req, res) => {
    try {
        // PERBAIKAN: Tambahkan 'phone' disini
        const { username, email, password, role, phone } = req.body;

        // Validasi Input Dasar
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, Email, dan Password wajib diisi!' });
        }
        
        // Cek apakah email sudah dipakai
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar, gunakan email lain.' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Buat User
        const newUser = await User.create({
            username, 
            email, 
            password: hashedPassword, 
            role: role || 'user', 
            phone: phone || null, // <--- PERBAIKAN: Simpan phone ke database
            isVerified: true
        });

        res.status(201).json({ message: 'User berhasil dibuat', user: newUser });

    } catch (error) {
        console.error("Error Create User:", error);
        res.status(500).json({ error: "Terjadi kesalahan server: " + error.message });
    }
};

// 2. UPDATE USER
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // PERBAIKAN: Tambahkan 'phone' disini
        const { username, email, role, password, phone } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        // Update data dasar
        user.username = username;
        user.email = email;
        user.role = role;
        user.phone = phone || null; // <--- PERBAIKAN: Update phone di database

        // Hanya update password jika diisi dan tidak kosong
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'Data user berhasil diperbarui' });

    } catch (error) {
        console.error("Error Update User:", error);
        res.status(500).json({ error: error.message });
    }
};