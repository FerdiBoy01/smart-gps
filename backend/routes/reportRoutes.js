const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User Routes
router.post('/', verifyToken, reportController.createReport);
router.get('/my', verifyToken, reportController.getMyReports);

// Admin Routes
router.get('/admin/all', verifyToken, isAdmin, reportController.getAllReports);
router.put('/admin/reply/:id', verifyToken, isAdmin, reportController.replyReport);

module.exports = router;