import axios from 'axios';
import { getToken } from './authService'; // Import dari file sebelah (satu folder)

// Ambil URL dasar dari .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Buat Instance Axios khusus Device
const deviceApi = axios.create({
    baseURL: `${BASE_URL}/devices`, // http://localhost:5000/api/devices
    headers: { 'Content-Type': 'application/json' }
});

const gpsApi = axios.create({
    baseURL: `${BASE_URL}/gps`,
    headers: { 'Content-Type': 'application/json' }
});

gpsApi.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));


// INTERCEPTOR: Otomatis pasang Token di setiap request
// (Penting! Agar backend tau siapa user yg request)
deviceApi.interceptors.request.use((config) => {
    const token = getToken(); // Ambil token dari authService
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// --- API FUNCTIONS (USER) ---

// 1. Ambil List Device User
export const getMyDevices = async () => {
    const response = await deviceApi.get('/my');
    return response.data;
};

// 2. Pairing Device Baru
export const pairDevice = async (data) => {
    const response = await deviceApi.post('/pair', data);
    return response.data;
};

// 3. Hapus Device (Unpair)
export const unpairDevice = async (id) => {
    const response = await deviceApi.post(`/unpair/${id}`);
    return response.data;
};

// --- API FUNCTIONS (ADMIN) ---

// 4. Ambil Semua Device (Admin)
export const getAllDevices = async () => {
    const response = await deviceApi.get('/admin/all');
    return response.data;
};

// 5. Generate Device Baru (Admin)
export const createDevice = async (data) => {
    const response = await deviceApi.post('/admin/create', data);
    return response.data;
};

// 6. Reset Device (Admin)
export const resetDevice = async (id) => {
    const response = await deviceApi.put(`/admin/reset/${id}`);
    return response.data;
};

export const getDeviceDetail = async (id) =>
     (await gpsApi.get(`/detail/${id}`)).data;



export const getDeviceHistory = async (id, startDate = null, endDate = null) => {
    let url = `/history/${id}`;
    
    // Jika ada tanggal, tambahkan ke URL
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await gpsApi.get(url);
    return response.data;
};

// User Update Device Name
export const updateDeviceName = async (id, name) => {
    const response = await deviceApi.put(`/update/${id}`, { name });
    return response.data;
};

export const updateSimInfo = async (id, data) => {
    const response = await deviceApi.put(`/admin/sim/${id}`, data);
    return response.data;
};