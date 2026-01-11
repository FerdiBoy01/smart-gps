const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 0), // Angka duit
        allowNull: false
    },
    image: {
        type: DataTypes.STRING, // Kita simpan URL gambar dulu biar simpel
        allowNull: true,
        defaultValue: "https://via.placeholder.com/300?text=No+Image"
    },
    category: {
        type: DataTypes.STRING, // Misal: "GPS", "Layanan", "Aksesoris"
        defaultValue: "General"
    },
    isPopular: {
        type: DataTypes.BOOLEAN, // Buat nandin produk unggulan
        defaultValue: false
    }
});

module.exports = Product;