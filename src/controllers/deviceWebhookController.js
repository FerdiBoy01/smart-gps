const { Location } = require('../models');

async function receiveLocation(req, res, next) {
  try {
    const { latitude, longitude, speed, battery } = req.body;
    if (typeof latitude === 'undefined' || typeof longitude === 'undefined') return res.status(400).json({ error: 'latitude and longitude required' });
    await Location.create({ device_id: req.device.id, latitude, longitude, speed: speed || null, battery: battery || null });
    return res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { receiveLocation };
