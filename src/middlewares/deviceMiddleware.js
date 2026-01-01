const { Device } = require('../models');

async function requireDeviceAuth(req, res, next) {
  try {
    const { device_hash, device_key } = req.body;
    if (!device_hash || !device_key) return res.status(400).json({ error: 'device_hash and device_key required' });
    const device = await Device.findOne({ where: { device_hash } });
    if (!device) return res.status(401).json({ error: 'Unknown device' });
    if (device.device_key !== device_key) return res.status(401).json({ error: 'Invalid device key' });
    if (device.status !== 'active') return res.status(403).json({ error: 'Device not active' });
    req.device = device;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireDeviceAuth };
