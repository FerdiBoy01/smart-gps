module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Device', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    device_hash: { type: DataTypes.STRING(128), unique: true, allowNull: false },
    device_key: { type: DataTypes.STRING(255), allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    label: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive', 'stolen'), defaultValue: 'inactive' },
    activated_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'devices', timestamps: true });
};
