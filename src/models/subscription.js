module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Subscription', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    plan: { type: DataTypes.STRING(100), allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false }
  }, { tableName: 'subscriptions', timestamps: true });
};
