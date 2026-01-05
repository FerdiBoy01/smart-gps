const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 👇👇👇 TAMBAHKAN BARIS INI (Wajib!) 👇👇👇
const { verifyToken } = require('../middleware/authMiddleware'); 
// 👆👆👆 Tanpa ini, server akan crash karena tidak kenal 'verifyToken'

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);

// --- Route yang butuh Login (Pakai verifyToken) ---
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/password', verifyToken, authController.changePassword);

module.exports = router;