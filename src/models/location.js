module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Location', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    device_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
    speed: { type: DataTypes.FLOAT, allowNull: true },
    battery: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  }, { tableName: 'locations', timestamps: true });
};
