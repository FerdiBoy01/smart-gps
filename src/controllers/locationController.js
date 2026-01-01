const { Device, Location } = require('../models');

async function listUserDevices(req, res, next) {
  try {
    const devices = await Device.findAll({ where: { user_id: req.user.id } });
    const result = await Promise.all(devices.map(async d => {
      const last = await Location.findOne({ where: { device_id: d.id }, order: [['created_at', 'DESC']] });
      return { id: d.id, device_hash: d.device_hash, label: d.label, status: d.status, last_location: last || null };
    }));
    res.json({ devices: result });
  } catch (err) { next(err); }
}

async function getDeviceLastLocation(req, res, next) {
  try {
    const deviceId = parseInt(req.params.deviceId, 10);
    const device = await Device.findOne({ where: { id: deviceId, user_id: req.user.id } });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    const last = await Location.findOne({ where: { device_id: device.id }, order: [['created_at', 'DESC']] });
    res.json({ device: { id: device.id, label: device.label, status: device.status }, last_location: last || null });
  } catch (err) { next(err); }
}

module.exports = { listUserDevices, getDeviceLastLocation };
