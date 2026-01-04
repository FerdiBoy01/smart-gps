const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GpsData = sequelize.define('GpsData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Kita simpan deviceId sebagai referensi, tapi tidak wajib relation ketat
    // agar insert data sangat cepat tanpa overhead pengecekan FK berlebih
    deviceId: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    speed: {
        type: DataTypes.FLOAT, // Opsional: kecepatan km/h
        defaultValue: 0
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    indexes: [
        { fields: ['deviceId'] }, // Index biar query history cepat
        { fields: ['timestamp'] }
    ]
});

module.exports = GpsData;