const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../services/emailService');

// 1. REGISTER
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Cek email sudah ada belum
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat User Baru (Status isVerified: false)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        // Generate 4 digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit dari sekarang

        // Simpan OTP ke DB
        await Otp.create({ email, otpCode, expiresAt });

        // Kirim Email
        await sendOtpEmail(email, otpCode);

        res.status(201).json({ 
            message: 'Registrasi berhasil. Silakan cek email untuk kode OTP.',
            userId: newUser.id 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. VERIFIKASI OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        // Cari OTP yang cocok dan belum kadaluarsa
        const validOtp = await Otp.findOne({
            where: {
                email,
                otpCode,
                expiresAt: { [Op.gt]: new Date() } // expiresAt > Waktu Sekarang
            }
        });

        if (!validOtp) {
            return res.status(400).json({ message: 'OTP salah atau sudah kadaluarsa' });
        }

        // Update User jadi Verified
        await User.update({ isVerified: true }, { where: { email } });

        // Hapus OTP bekas agar database bersih
        await Otp.destroy({ where: { email } });

        res.json({ message: 'Akun berhasil diverifikasi! Silakan login.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cek User
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        // Cek Verifikasi
        if (!user.isVerified) return res.status(403).json({ message: 'Akun belum diverifikasi. Cek email OTP.' });

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Password salah' });

        // Buat Token (JWT)
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token berlaku 1 hari
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};