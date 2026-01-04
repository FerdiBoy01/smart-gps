const express = require('express');
const router = express.Router();
const gpsController = require('../controllers/gpsController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint Public (Untuk IoT Device mengirim data)
// Tidak pakai verifyToken karena device pakai key sendiri
router.post('/data', gpsController.receiveGpsData);

// Endpoint Private (Untuk User melihat data)
router.get('/history/:id', verifyToken, gpsController.getDeviceHistory);
router.get('/detail/:id', verifyToken, gpsController.getDeviceDetail);

module.exports = router;