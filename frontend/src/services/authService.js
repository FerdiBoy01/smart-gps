import axios from 'axios';

// 1. Ambil URL Dasar dari .env (Pastikan .env VITE_API_BASE_URL=http://localhost:5000/api)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Instance Axios khusus Auth
const authApi = axios.create({
    baseURL: `${BASE_URL}/auth`, // http://localhost:5000/api/auth
    headers: { 'Content-Type': 'application/json' }
});

// --- API FUNCTIONS (PUBLIC) ---

export const registerUser = async (userData) => {
    const response = await authApi.post('/register', userData);
    return response.data;
};

export const verifyOtp = async (otpData) => {
    const response = await authApi.post('/verify-otp', otpData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await authApi.post('/login', loginData);
    if (response.data.token) {
        // Simpan response lengkap { user: {...}, token: "..." }
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// --- HELPER FUNCTIONS ---

export const logoutUser = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// Ambil data User lengkap (untuk ditampilkan nama, role, dll)
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    // Struktur di localStorage adalah { user: {...}, token: "..." }
    return userStr ? JSON.parse(userStr).user : null;
};

// Ambil Token saja
export const getToken = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).token : null;
};

// --- API FUNCTIONS (PRIVATE / PERLU TOKEN) ---

// Update Profil
export const updateProfileAPI = async (data) => {
    const token = getToken();
    
    // PERBAIKAN 1: Ganti API_URL menjadi BASE_URL
    const response = await axios.put(`${BASE_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    // PERBAIKAN 2: Logic update localStorage agar struktur tidak rusak
    const storedData = JSON.parse(localStorage.getItem('user')) || {};
    
    // Kita update properti 'user' di dalam storedData, bukan menimpa root object
    if (storedData.user) {
        storedData.user = { ...storedData.user, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(storedData));
    }
    
    return response.data;
};

// Ganti Password
export const changePasswordAPI = async (data) => {
    const token = getToken();
    
    // PERBAIKAN 3: Ganti API_URL menjadi BASE_URL
    const response = await axios.put(`${BASE_URL}/auth/password`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
};