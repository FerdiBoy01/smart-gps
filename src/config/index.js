module.exports = {
  sessionExpiresDays: parseInt(process.env.SESSION_EXPIRES_DAYS || '7', 10)
};
