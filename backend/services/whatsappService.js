const axios = require('axios');

// Pastikan Token Fonnte Anda aman. 
// Idealnya simpan di file .env dengan nama FONNTE_TOKEN
const FONNTE_TOKEN = 'YnSC9Zaa1oSDmz5bni2X'; 

exports.sendWhatsApp = async (phone, message) => {
    try {
        // Fonnte API Endpoint
        const response = await axios.post('https://api.fonnte.com/send', {
            target: phone,   // Nomor tujuan (bisa 0812... atau 62812...)
            message: message,
            countryCode: '62', // Otomatis ubah 08 jadi 62
        }, {
            headers: {
                Authorization: FONNTE_TOKEN
            }
        });

        // Cek respon dari Fonnte
        if (response.data.status) {
            console.log(`[WA SENT] Success ke ${phone}`);
            return true;
        } else {
            console.error(`[WA FAILED] Fonnte Error: ${response.data.reason}`);
            return false;
        }
    } catch (error) {
        console.error("[SYSTEM ERROR] Gagal request ke Fonnte:", error.message);
        return false;
    }
};