const { Device, GpsData } = require('../models');
const { Op } = require('sequelize');

// 1. TERIMA DATA DARI IOT/HP (Endpoint Umum Tanpa Login User)
exports.receiveGpsData = async (req, res) => {
    try {
        const { device_id, device_key, latitude, longitude, timestamp } = req.body;

        // Validasi Payload
        if (!device_id || !device_key || !latitude || !longitude) {
            return res.status(400).json({ message: 'Data tidak lengkap' });
        }

        // 1. Cek Validitas Device (Authentication)
        // Kita cari berdasarkan custom ID (GPS-001) dan key (pairing code)
        const device = await Device.findOne({ 
            where: { 
                deviceId: device_id, 
                pairingCode: device_key 
            } 
        });

        if (!device) {
            return res.status(401).json({ message: 'Unauthorized: Device ID atau Key salah' });
        }

        if (device.status !== 'active') {
            return res.status(403).json({ message: 'Device non-aktif' });
        }

        // 2. Simpan ke History (GpsData)
        await GpsData.create({
            deviceId: device.id, // Pakai ID Auto Increment database
            latitude,
            longitude,
            timestamp: timestamp || new Date()
        });

        // 3. Update Status Terkini Device (Hot Data)
        // Ini agar dashboard admin/user tidak perlu scan tabel history yang besar
        device.lastLatitude = latitude;
        device.lastLongitude = longitude;
        device.lastActive = new Date();

        await device.increment('dataUsedKB', { by: 1 });
        
        await device.save();

        res.status(200).json({ message: 'Data saved' });

    } catch (error) {
        console.error("GPS Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. AMBIL HISTORY DEVICE (DENGAN FILTER)
exports.getDeviceHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query; // Ambil dari query param (?startDate=...&endDate=...)

        // Cek device milik user
        const device = await Device.findOne({ 
            where: { id, userId: req.user.id } 
        });

        if (!device) return res.status(404).json({ message: 'Device tidak ditemukan' });

        // Default: Ambil history hari ini (00:00 - 23:59) jika tidak ada filter
        let whereClause = { deviceId: device.id };

        if (startDate && endDate) {
            // Jika user memilih tanggal
            const start = new Date(startDate); // 2023-10-01 00:00
            const end = new Date(endDate);     // 2023-10-01 23:59 (atau tanggal beda)
            
            whereClause.timestamp = {
                [Op.between]: [start, end]
            };
        } else {
            // Default: Ambil 100 data terakhir saja (biar ringan saat pertama buka)
             const recentData = await GpsData.findAll({
                where: { deviceId: device.id },
                order: [['timestamp', 'DESC']],
                limit: 100
            });
            // Kita reverse biar urut dari lama ke baru (untuk garis Polyline)
            return res.json(recentData.reverse());
        }

        // Query Database dengan Filter Tanggal
        const history = await GpsData.findAll({
            where: whereClause,
            order: [['timestamp', 'ASC']], // Urutkan dari pagi ke malam
            limit: 2000 // Batasi max 2000 titik agar browser tidak lag
        });

        res.json(history);

    } catch (error) {
        console.error("History Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. GET SINGLE DEVICE DETAIL (Termasuk Last Loc)
exports.getDeviceDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await Device.findOne({ where: { id, userId: req.user.id } });
        if (!device) return res.status(404).json({ message: 'Device not found' });
        res.json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};