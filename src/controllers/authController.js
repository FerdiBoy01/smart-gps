const { User, Session } = require('../models');
const { genSessionToken, calcExpiryDate } = require('../services/tokenService');

async function login(req, res, next) {
  try {
    const { user_key } = req.body;
    if (!user_key) return res.status(400).json({ error: 'user_key required' });
    const user = await User.findOne({ where: { user_key } });
    if (!user) return res.status(401).json({ error: 'Invalid user_key' });
    if (user.status !== 'active') return res.status(403).json({ error: 'User blocked' });
    const token = genSessionToken();
    const expired_at = calcExpiryDate();
    await Session.create({ user_id: user.id, session_token: token, expired_at });
    return res.json({ session_token: token, expired_at });
  } catch (err) { next(err); }
}

module.exports = { login };
