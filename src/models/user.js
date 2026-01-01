module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_key: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: true },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    status: { type: DataTypes.ENUM('active', 'blocked'), defaultValue: 'active' }
  }, { tableName: 'users', timestamps: true });
};
