function ok(res, data) { return res.json({ ok: true, ...data }); }
function err(res, status, message) { return res.status(status).json({ ok: false, error: message }); }

module.exports = { ok, err };
