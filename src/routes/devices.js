const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const { claimDevice } = require('../controllers/deviceController');

router.post('/claim', requireAuth, claimDevice);

module.exports = router;
