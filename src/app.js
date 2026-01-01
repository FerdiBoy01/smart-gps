require('dotenv').config();
const express = require('express');
const bodyParser = require('express').json;
const { sequelize } = require('./database');
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const webhookRoutes = require('./routes/deviceWebhook');
const locationRoutes = require('./routes/locations');

const app = express();
app.use(bodyParser());

app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/device', webhookRoutes);
app.use('/locations', locationRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

module.exports = app;
