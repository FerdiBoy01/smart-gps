import axios from 'axios';

// 1. Ambil URL Dasar dari .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Instance Axios khusus Admin
const adminApi = axios.create({
    baseURL: `${BASE_URL}/admin`, // http://localhost:5000/api/admin
    headers: { 'Content-Type': 'application/json' }
});

// 3. INTERCEPTOR: Otomatis pasang Token di Header Authorization
adminApi.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const token = JSON.parse(userStr).token;
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// --- API FUNCTIONS ---

export const getAllUsers = async () => {
    const response = await adminApi.get('/users');
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await adminApi.delete(`/users/${id}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await adminApi.post('/users', userData);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await adminApi.put(`/users/${id}`, userData);
    return response.data;
};  