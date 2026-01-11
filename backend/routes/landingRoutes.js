const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Pastikan path middleware benar

router.get('/', landingController.getContent);
router.put('/', verifyToken, isAdmin, landingController.updateContent);

module.exports = router;