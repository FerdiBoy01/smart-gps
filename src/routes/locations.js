const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { listUserDevices, getDeviceLastLocation } = require('../controllers/locationController');

router.get('/devices', requireAuth, listUserDevices);
router.get('/devices/:deviceId/last', requireAuth, getDeviceLastLocation);

module.exports = router;
