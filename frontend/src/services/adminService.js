import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Helper untuk ambil token dari storage
const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, { headers: getAuthHeader() });
    return response.data;
};