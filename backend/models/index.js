const User = require('./User');
const Device = require('./Device');
const Otp = require('./Otp');
const GpsData = require('./GpsData');
const Report = require('./Report');
const Product = require('./Product');

// --- PANGGIL MODEL BARU (Gaya Simpel) ---
const LandingContent = require('./LandingContent'); 
// ----------------------------------------

// --- DEFINISI RELASI (ASSOCIATIONS) ---

// User & Device
User.hasMany(Device, { foreignKey: 'userId', as: 'devices' });
Device.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User & Report
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });

// Device & GpsData
Device.hasMany(GpsData, { foreignKey: 'deviceId', as: 'history' });
GpsData.belongsTo(Device, { foreignKey: 'deviceId' });

// Export semua
module.exports = {
    User,
    Device,
    Otp,
    GpsData,
    Report,
    LandingContent,
    Product
};