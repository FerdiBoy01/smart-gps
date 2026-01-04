const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Proteksi Ganda: Harus Punya Token (Login) DAN Harus Admin
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);
router.post('/users', verifyToken, isAdmin, adminController.createUser);
router.put('/users/:id', verifyToken, isAdmin, adminController.updateUser);

module.exports = router;