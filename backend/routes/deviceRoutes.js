const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const userDev = require('../controllers/deviceUserController');
const adminDev = require('../controllers/deviceAdminController');

// --- ROUTES USER ---
router.get('/my', verifyToken, userDev.getMyDevices); 
router.post('/pair', verifyToken, userDev.pairDevice); // <--- PASTIKAN INI ADA & POST
router.post('/unpair/:id', verifyToken, userDev.unpairDevice);

// --- ROUTES ADMIN ---
router.get('/admin/all', verifyToken, isAdmin, adminDev.getAllDevices);
router.post('/admin/create', verifyToken, isAdmin, adminDev.createDevice);
router.put('/admin/reset/:id', verifyToken, isAdmin, adminDev.resetDevice);

module.exports = router;