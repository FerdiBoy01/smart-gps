module.exports = (sequelize, DataTypes) => {
  return sequelize.define('DeviceClaimLog', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    device_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ip_address: { type: DataTypes.STRING(100), allowNull: true }
  }, { tableName: 'device_claim_logs', timestamps: true });
};
