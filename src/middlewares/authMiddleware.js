const { Session, User } = require('../models');

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.slice(7);
    const session = await Session.findOne({ where: { session_token: token } });
    if (!session) return res.status(401).json({ error: 'Invalid session' });
    if (new Date(session.expired_at) < new Date()) return res.status(401).json({ error: 'Session expired' });
    const user = await User.findByPk(session.user_id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
