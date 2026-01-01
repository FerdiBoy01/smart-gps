const crypto = require('crypto');
const { sessionExpiresDays } = require('../config');

function genSessionToken() {
  return crypto.randomBytes(48).toString('hex');
}

function calcExpiryDate() {
  const days = sessionExpiresDays || 7;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

module.exports = { genSessionToken, calcExpiryDate };
