import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

// User: Kirim Laporan
export const createReport = async (data) => {
    const response = await axios.post(`${API_URL}/reports`, data, getAuthHeader());
    return response.data;
};

// User: Ambil Laporan Saya
export const getMyReports = async () => {
    const response = await axios.get(`${API_URL}/reports/my`, getAuthHeader());
    return response.data;
};

// Admin: Ambil Semua Laporan
export const getAllReports = async () => {
    const response = await axios.get(`${API_URL}/reports/admin/all`, getAuthHeader());
    return response.data;
};

// Admin: Kirim Balasan
export const replyReport = async (id, reply) => {
    const response = await axios.put(`${API_URL}/reports/admin/reply/${id}`, { reply }, getAuthHeader());
    return response.data;
};