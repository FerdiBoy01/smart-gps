const express = require('express');
const router = express.Router();
const { requireDeviceAuth } = require('../middlewares/deviceMiddleware');
const { receiveLocation } = require('../controllers/deviceWebhookController');

router.post('/webhook', requireDeviceAuth, receiveLocation);

module.exports = router;
