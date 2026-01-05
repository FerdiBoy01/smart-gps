const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Device = sequelize.define('Device', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // 1 ID unik per alat
    },
    pairingCode: {
        type: DataTypes.STRING,
        allowNull: false // Kode rahasia untuk pairing
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true // Nama panggilan (misal: Mobil Avanza)
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = Belum dipairing (Unpaired)
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    lastLatitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    lastLongitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    lastActive: {
        type: DataTypes.DATE, // Kapan terakhir device kirim data
        allowNull: true
    },

    // --- FITUR BARU: MONITORING SIM & KUOTA ---
    simProvider: {
        type: DataTypes.STRING, // Contoh: 'Telkomsel', 'Indosat'
        allowNull: true
    },
    simNumber: {
        type: DataTypes.STRING, // Contoh: '0812...'
        allowNull: true
    },
    dataLimitMB: {
        type: DataTypes.FLOAT, // Total Kuota Paket (misal: 1000 MB)
        defaultValue: 0
    },
    dataUsedKB: {
        type: DataTypes.FLOAT, // Penghitung pemakaian (akan nambah terus)
        defaultValue: 0
    },
    quotaWarningThreshold: {
        type: DataTypes.INTEGER, // Persentase warning (misal: 80%)
        defaultValue: 80
    }
});

module.exports = Device;