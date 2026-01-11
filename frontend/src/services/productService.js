import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; 

const getAuthHeader = () => {
    let token = localStorage.getItem('token');
    if (!token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { token = JSON.parse(storedUser).token; } catch (e) {}
        }
    }
    return token ? { 
        Authorization: `Bearer ${token}`,
        // Penting: Jangan set Content-Type manual ke 'application/json' jika pakai FormData
        // Axios akan otomatis set ke 'multipart/form-data'
    } : {};
};

export const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Ubah parameter jadi formData
export const createProduct = async (formData) => {
    const response = await axios.post(API_URL, formData, { headers: getAuthHeader() });
    return response.data;
};

// Ubah parameter jadi formData
export const updateProduct = async (id, formData) => {
    const response = await axios.put(`${API_URL}/${id}`, formData, { headers: getAuthHeader() });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
};