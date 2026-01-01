const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = require('./user')(sequelize, DataTypes);
const Device = require('./device')(sequelize, DataTypes);
const DeviceClaimLog = require('./deviceClaimLog')(sequelize, DataTypes);
const Location = require('./location')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const Subscription = require('./subscription')(sequelize, DataTypes);

User.hasMany(Device, { foreignKey: 'user_id' });
Device.belongsTo(User, { foreignKey: 'user_id' });

Device.hasMany(Location, { foreignKey: 'device_id' });
Location.belongsTo(Device, { foreignKey: 'device_id' });

Device.hasMany(DeviceClaimLog, { foreignKey: 'device_id' });
DeviceClaimLog.belongsTo(Device, { foreignKey: 'device_id' });

User.hasMany(DeviceClaimLog, { foreignKey: 'user_id' });
DeviceClaimLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Session, { foreignKey: 'user_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Device,
  DeviceClaimLog,
  Location,
  Session,
  Subscription
};
