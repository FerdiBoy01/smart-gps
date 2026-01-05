const Device = require('../models/Device');

// 1. LIST DEVICE SAYA
exports.getMyDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({ where: { userId: req.user.id } });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. PAIRING DEVICE (KLAIM)
exports.pairDevice = async (req, res) => {
    try {

        console.log("--> Request Pairing Masuk!");
        console.log("Body:", req.body);

        const { deviceId, pairingCode, name } = req.body;
        const userId = req.user.id;

        const device = await Device.findOne({ where: { deviceId, pairingCode } });

        if (!device) {
            console.log("--> Device TIDAK DITEMUKAN di Database");
            return res.status(404).json({ message: 'Device ID atau Pairing Code salah!' });
        }
        if (device.userId !== null) return res.status(400).json({ message: 'Device ini sudah diklaim orang lain.' });
        if (device.status !== 'active') return res.status(400).json({ message: 'Device non-aktif.' });

        device.userId = userId;
        device.name = name || device.deviceId;
        await device.save();

        res.json({ message: 'Berhasil menghubungkan device!', device });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. UNPAIR (HAPUS DARI AKUN)
exports.unpairDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const device = await Device.findOne({ where: { id, userId } });
        if (!device) return res.status(404).json({ message: 'Device tidak ditemukan.' });

        device.userId = null;
        device.name = null;
        await device.save();

        res.json({ message: 'Device berhasil dihapus dari akun.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. EDIT DEVICE (Ganti Nama)
exports.updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const device = await Device.findOne({ where: { id, userId: req.user.id } });
        if (!device) return res.status(404).json({ message: 'Device tidak ditemukan' });

        device.name = name;
        await device.save();
        res.json({ message: 'Nama device diupdate', device });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};