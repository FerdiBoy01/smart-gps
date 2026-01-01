module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Session', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    session_token: { type: DataTypes.STRING(255), allowNull: false },
    expired_at: { type: DataTypes.DATE, allowNull: false }
  }, { tableName: 'sessions', timestamps: true });
};
