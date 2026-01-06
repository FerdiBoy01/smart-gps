const { Report, User } = require('../models');

// 1. USER: Buat Laporan Baru
exports.createReport = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const report = await Report.create({
            userId: req.user.id,
            subject,
            message,
            status: 'pending'
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. USER: Lihat Laporan Saya
exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. ADMIN: Lihat Semua Laporan
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [{ 
                model: User, 
                as: 'reporter', 
                attributes: ['username', 'email'] 
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. ADMIN: Balas Laporan
exports.replyReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        const report = await Report.findByPk(id);
        if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

        report.adminReply = reply;
        report.status = 'replied';
        await report.save();

        res.json({ message: 'Balasan terkirim', report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};