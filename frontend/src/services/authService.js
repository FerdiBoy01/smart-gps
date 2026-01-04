import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const verifyOtp = async (otpData) => {
    const response = await axios.post(`${API_URL}/verify-otp`, otpData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_URL}/login`, loginData);
    if (response.data.token) {
        // Simpan seluruh objek respons (token + user info)
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
};