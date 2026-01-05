const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Import Controller
const userDev = require('../controllers/deviceUserController');
const adminDev = require('../controllers/deviceAdminController');

// ==========================================
// ROUTES USER (Prefix: /api/devices)
// ==========================================
router.get('/my', verifyToken, userDev.getMyDevices); 
router.post('/pair', verifyToken, userDev.pairDevice); 
router.post('/unpair/:id', verifyToken, userDev.unpairDevice);

// ==========================================
// ROUTES ADMIN (Prefix: /api/devices)
// ==========================================
router.get('/admin/all', verifyToken, isAdmin, adminDev.getAllDevices);
router.post('/admin/create', verifyToken, isAdmin, adminDev.createDevice);
router.put('/admin/reset/:id', verifyToken, isAdmin, adminDev.resetDevice);

// 👇👇👇 INI YANG KEMUNGKINAN BESAR HILANG 👇👇👇
router.put('/admin/sim/:id', verifyToken, isAdmin, adminDev.updateSimInfo); 
// 👆👆👆 PASTIKAN BARIS DI ATAS INI ADA

module.exports = router;