// --- PERUBAHAN DI SINI ---
// Kita langsung panggil LandingContent dari index.js, tidak perlu pakai "db."
const { LandingContent } = require('../models'); 
// -------------------------

// Ambil Data (Untuk Halaman Depan & Admin Load)
exports.getContent = async (req, res) => {
    try {
        console.log("Mengambil data Landing Page...");
        
        // Cari data pertama
        let content = await LandingContent.findOne();
        
        // Jika belum ada (pertama kali run), buat default
        if (!content) {
            console.log("Data kosong, membuat default...");
            content = await LandingContent.create({});
        }
        
        res.json(content);
    } catch (error) {
        console.error("Error LandingController:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateContent = async (req, res) => {
    try {
        console.log(">>> REQUEST UPDATE MASUK! <<<");
        console.log("Data dari Frontend:", req.body); // <-- Cek apa yang dikirim Frontend
        console.log("User yang Request:", req.user);  // <-- Cek siapa yang request (dari middleware)

        const { heroTitle, heroSubtitle, adminPhone, price, features } = req.body;
        
        let content = await LandingContent.findOne();
        
        if (!content) {
            console.log("Data lama kosong, membuat baru...");
            content = await LandingContent.create(req.body);
        } else {
            console.log("Mengupdate data lama...");
            content.heroTitle = heroTitle;
            content.heroSubtitle = heroSubtitle;
            content.adminPhone = adminPhone;
            content.price = price;
            content.features = features; 
            
            await content.save();
        }
        
        console.log(">>> UPDATE SUKSES! <<<");
        res.json({ message: "Konten berhasil diupdate!", content });

    } catch (error) {
        console.error("❌ ERROR SAAT UPDATE:", error); // <-- Ini akan muncul di terminal jika error
        res.status(500).json({ message: error.message });
    }
};