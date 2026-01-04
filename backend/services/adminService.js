import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, { headers: getAuthHeader() });
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData, { headers: getAuthHeader() });
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, { headers: getAuthHeader() });
    return response.data;
};