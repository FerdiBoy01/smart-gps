const cron = require('node-cron');
const { Device, User } = require('../models');
const { sendWhatsApp } = require('../services/whatsappService');
const { Op } = require('sequelize');

const startQuotaChecker = () => {
    // JADWAL PRODUKSI: Jalankan setiap jam 09:00 Pagi
    // Format Cron: Menit Jam Tanggal Bulan Hari
    cron.schedule('0 9 * * *', async () => {
        console.log('--- [CRON JOB] Memulai Pengecekan Kuota Harian ---');
        
        try {
            // Ambil device yang punya limit & punya pemilik
            const devices = await Device.findAll({
                where: {
                    dataLimitMB: { [Op.gt]: 0 },
                    userId: { [Op.not]: null }
                },
                include: [{ model: User, as: 'owner' }]
            });

            const now = new Date();
            let sentCount = 0;

            for (const dev of devices) {
                // Hitung Persentase Pemakaian
                const usedMB = dev.dataUsedKB / 1024;
                const percentage = (usedMB / dev.dataLimitMB) * 100;

                // LOGIC 1: Apakah sudah KRITIS (>= 90%)?
                const isCritical = percentage >= 90;
                
                // LOGIC 2: Apakah sudah dikirim notif dalam 24 jam terakhir?
                const lastNotif = dev.lastQuotaNotification ? new Date(dev.lastQuotaNotification) : null;
                const alreadySentToday = lastNotif && (now - lastNotif) < 24 * 60 * 60 * 1000;

                // EKSEKUSI JIKA MEMENUHI SYARAT
                if (isCritical && !alreadySentToday) {
                    
                    // Cek kelengkapan nomor HP User
                    if (dev.owner && dev.owner.phone) {
                        const status = percentage >= 100 ? "HABIS (100%)" : "MENIPIS (90%)";
                        
                        const message = `Halo ${dev.owner.username},\n\n` +
                                        `⚠️ *PERINGATAN KUOTA GPS*\n` +
                                        `Kendaraan: ${dev.name} (${dev.deviceId})\n` +
                                        `Status Kuota: *${status}*\n\n` +
                                        `Sisa kuota data kartu GPS Anda sudah sangat kritis. ` +
                                        `Segera lakukan pengisian ulang agar pelacakan tidak terputus.\n\n` +
                                        `Terima kasih,\n` +
                                        `*Admin SmartGPS*`;

                        const success = await sendWhatsApp(dev.owner.phone, message);

                        if (success) {
                            console.log(`[WA SENT] Notifikasi terkirim ke ${dev.owner.username}`);
                            dev.lastQuotaNotification = new Date();
                            await dev.save();
                            sentCount++;
                        }
                    }
                }
            }
            console.log(`--- [CRON JOB] Selesai. Terkirim ke ${sentCount} user. ---`);

        } catch (error) {
            console.error("[CRON ERROR] Terjadi kesalahan:", error);
        }
    });
};

module.exports = startQuotaChecker;