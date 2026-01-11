const db = require('./models'); // Panggil semua model yang sudah didaftarkan

async function createTable() {
    try {
        console.log("⏳ Sedang mencoba koneksi ke database...");
        
        // Cek apakah model LandingContent terbaca
        if (!db.LandingContent) {
            throw new Error("Model 'LandingContent' tidak ditemukan di models/index.js! Cek file index.js kamu.");
        }

        console.log("✅ Model ditemukan. Mulai sinkronisasi...");

        // Perintah sakti untuk membuat tabel yang belum ada
        await db.sequelize.sync({ alter: true });

        console.log("🎉 BERHASIL! Tabel 'LandingContents' sudah dibuat di Database.");
    } catch (error) {
        console.error("❌ GAGAL MEMBUAT TABEL:", error.message);
        console.error(error);
    } finally {
        process.exit();
    }
}

createTable();