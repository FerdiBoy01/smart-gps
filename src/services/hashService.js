const crypto = require('crypto');

function hashDeviceId(deviceId) {
  return crypto.createHash('sha256').update(deviceId).digest('hex');
}

function genDeviceKey() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { hashDeviceId, genDeviceKey };
