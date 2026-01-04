const User = require('./User');
const Device = require('./Device');
const Otp = require('./Otp'); // Kita masukkan juga biar sekalian rapi

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

// Export semua model yang sudah berelasi
module.exports = {
    User,
    Device,
    Otp
};