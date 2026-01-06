const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    adminReply: {
        type: DataTypes.TEXT,
        allowNull: true // Kosong jika belum dibalas
    },
    status: {
        type: DataTypes.ENUM('pending', 'replied', 'closed'),
        defaultValue: 'pending'
    }
});

module.exports = Report;