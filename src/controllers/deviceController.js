const { Device, DeviceClaimLog } = require('../models');
const { hashDeviceId, genDeviceKey } = require('../services/hashService');

async function claimDevice(req, res, next) {
  try {
    const { device_id } = req.body;
    if (!device_id) return res.status(400).json({ error: 'device_id required' });
    const device_hash = hashDeviceId(device_id);
    const device = await Device.findOne({ where: { device_hash } });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    // assign device to user
    device.user_id = req.user.id;
    device.activated_at = new Date();
    device.status = 'active';
    await device.save();
    await DeviceClaimLog.create({ device_id: device.id, user_id: req.user.id, ip_address: req.ip });
    // never reveal device_key to app
    const safe = { id: device.id, device_hash: device.device_hash, label: device.label, status: device.status, activated_at: device.activated_at };
    return res.json({ device: safe });
  } catch (err) { next(err); }
}

module.exports = { claimDevice };
