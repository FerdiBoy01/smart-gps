import axios from 'axios';

// 1. Ambil URL Dasar dari .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Instance Axios khusus Auth
const authApi = axios.create({
    baseURL: `${BASE_URL}/auth`, // http://localhost:5000/api/auth
    headers: { 'Content-Type': 'application/json' }
});

// --- API FUNCTIONS ---

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
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// --- HELPER FUNCTIONS ---

export const logoutUser = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).user : null;
};