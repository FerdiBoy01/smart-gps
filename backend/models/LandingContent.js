const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan path ini dengan config kamu

const LandingContent = sequelize.define('LandingContent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    heroTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pantau Aset Berharga Anda Dimanapun, Kapanpun."
    },
    heroSubtitle: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Solusi pelacakan kendaraan real-time dengan akurasi tinggi."
    },
    adminPhone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "6285376550460"
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "499.000"
    },
    features: {
        type: DataTypes.JSON, // Menyimpan array fitur
        defaultValue: [
            { title: "Lacak Real-Time", desc: "Pantau posisi kendaraan detik ini juga." },
            { title: "Riwayat Perjalanan", desc: "Putar ulang rute perjalanan hingga 90 hari." },
            { title: "Matikan Mesin", desc: "Fitur keamanan darurat jarak jauh." }
        ]
    }
});

module.exports = LandingContent;