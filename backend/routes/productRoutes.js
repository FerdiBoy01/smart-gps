const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <--- Import ini

// Public
router.get('/', productController.getAllProducts);

// Private (Admin Only)
// Tambahkan 'upload.single('image')' di tengah
router.post('/', verifyToken, isAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;