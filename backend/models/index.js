const User = require('./User');
const Device = require('./Device');
const Otp = require('./Otp');
const GpsData = require('./GpsData'); // Kita masukkan juga biar sekalian rapi
const Report = require('./Report');

// --- DEFINISI RELASI (ASSOCIATIONS) ---

// 1 User bisa punya Banyak Device
User.hasMany(Device, { 
    foreignKey: 'userId',
    as: 'devices' // Alias biar nanti bisa panggil user.devices
});

// 1 Device dimiliki oleh 1 User
Device.belongsTo(User, { 
    foreignKey: 'userId',
    as: 'owner' // Alias biar nanti bisa panggil device.owner
});

// Relasi Baru (Report)
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });

// Export semua model yang sudah berelasi
Device.hasMany(GpsData, { foreignKey: 'deviceId', as: 'history' });
GpsData.belongsTo(Device, { foreignKey: 'deviceId' });
module.exports = {
    User,
    Device,
    Otp,
    GpsData,
    Report
};