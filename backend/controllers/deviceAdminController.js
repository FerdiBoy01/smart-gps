// Import dari folder models (index.js) agar relasi terbaca
const { Device, User } = require('../models'); 

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// 1. LIHAT SEMUA DEVICE
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({
            include: [{ 
                model: User, 
                as: 'owner', // <--- WAJIB ADA (Sesuai dengan models/index.js)
                attributes: ['username', 'email'] 
            }]
        });
        res.json(devices);
    } catch (error) {
        console.error("Error Get Devices:", error); // Biar kelihatan di terminal
        res.status(500).json({ error: error.message });
    }
};

// 2. GENERATE DEVICE BARU
exports.createDevice = async (req, res) => {
    try {
        const { deviceId } = req.body;
        
        // Cek duplikat
        const exist = await Device.findOne({ where: { deviceId } });
        if (exist) return res.status(400).json({ message: 'Device ID sudah ada' });

        const pairingCode = generateCode(); // Auto generate code

        const newDevice = await Device.create({
            deviceId,
            pairingCode,
            status: 'active'
        });

        res.status(201).json({ message: 'Device dibuat', device: newDevice });
    } catch (error) {
        console.error("Error Create Device:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. RESET PAIRING (KICK USER)
exports.resetDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await Device.findByPk(id);
        
        if (!device) return res.status(404).json({ message: 'Device tidak ditemukan' });

        // Reset logika
        device.userId = null;
        device.name = null; 
        device.pairingCode = generateCode(); 
        
        await device.save();
        res.json({ message: 'Device berhasil di-reset (Unpaired paksa)', newCode: device.pairingCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. UPDATE INFO SIM (Admin Only)
exports.updateSimInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { simProvider, simNumber, dataLimitMB, resetUsage } = req.body;

        const device = await Device.findByPk(id);
        if (!device) return res.status(404).json({ message: 'Device not found' });

        // Update Info
        if (simProvider !== undefined) device.simProvider = simProvider;
        if (simNumber !== undefined) device.simNumber = simNumber;
        if (dataLimitMB !== undefined) device.dataLimitMB = parseFloat(dataLimitMB);

        // Fitur Reset
        if (resetUsage) {
            device.dataUsedKB = 0;
        }

        await device.save();
        res.json({ message: 'Info SIM berhasil diupdate', device });
    } catch (error) {
        console.error("Error Update SIM:", error); // Biar muncul di terminal
        res.status(500).json({ error: error.message });
    }
};