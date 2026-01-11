import axios from 'axios';

const API_URL = 'http://localhost:5000/api/landing-content'; 

export const getLandingContent = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Gagal ambil konten:", error);
        throw error;
    }
};

export const updateLandingContent = async (data) => {
    // --- PERBAIKAN PENCARIAN TOKEN ---
    let token = localStorage.getItem('token'); 

    // Jika di key 'token' kosong, cari di dalam key 'user'
    if (!token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Tokennya sembunyi di sini: parsed.token
                token = parsed.token; 
            } catch (e) {
                console.error("Gagal bongkar data user dari storage", e);
            }
        }
    }

    console.log("🎫 TOKEN AKHIRNYA KETEMU:", token); // <-- Cek console lagi nanti

    if (!token) {
        alert("Sesi habis. Silakan Login ulang.");
        throw new Error("Token tidak ditemukan dimanapun.");
    }

    const response = await axios.put(API_URL, data, {
        headers: { 
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json'
        }
    });
    
    return response.data;
};