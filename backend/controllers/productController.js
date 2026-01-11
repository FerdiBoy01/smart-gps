const { Product } = require('../models');

// Helper untuk dapat URL lengkap
const getImageUrl = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        // Cek apakah ada file diupload?
        let imageUrl = "https://via.placeholder.com/300?text=No+Image"; // Default
        
        if (req.file) {
            imageUrl = getImageUrl(req, req.file.filename);
        }

        const product = await Product.create({
            ...req.body,
            image: imageUrl
        });

        res.status(201).json({ message: "Produk berhasil dibuat!", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // Jika user upload gambar baru, update field image
        if (req.file) {
            updateData.image = getImageUrl(req, req.file.filename);
        }

        const [updated] = await Product.update(updateData, { where: { id } });
        
        if (updated) {
            const updatedProduct = await Product.findByPk(id);
            res.json({ message: "Produk diupdate!", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Produk tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Opsional: Hapus file gambar dari folder uploads jika perlu (skip dulu biar simpel)
        const deleted = await Product.destroy({ where: { id } });
        
        if (deleted) {
            res.json({ message: "Produk dihapus!" });
        } else {
            res.status(404).json({ message: "Produk tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};