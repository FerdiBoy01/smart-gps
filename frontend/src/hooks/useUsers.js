import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, createUser, updateUser } from '../services/adminService';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [alert, setAlert] = useState(null);
    
    // State Modal
    const [modal, setModal] = useState({ isOpen: false, isEdit: false, currentId: null });
    
    // Form Data
    const initialForm = { username: '', email: '', password: '', role: 'user' };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Gagal load users:", error);
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- FIX LOGIC SAVE ---
    const handleSave = async (e) => {
        e.preventDefault();
        setAlert(null); // Reset alert sebelumnya

        try {
            if (modal.isEdit) {
                // Mode Edit
                await updateUser(modal.currentId, formData);
                setAlert({ type: 'success', message: 'User berhasil diperbarui' });
            } else {
                // Mode Tambah
                // Validasi Frontend Sederhana
                if (!formData.password) {
                    setAlert({ type: 'error', message: 'Password wajib diisi untuk user baru!' });
                    return;
                }
                await createUser(formData);
                setAlert({ type: 'success', message: 'User baru berhasil dibuat' });
            }
            
            // Tutup modal & Refresh data
            setModal({ ...modal, isOpen: false });
            loadUsers();

        } catch (error) {
            // Tampilkan pesan error spesifik dari Backend
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Gagal menyimpan data';
            setAlert({ type: 'error', message: errorMsg });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin hapus user ini?')) {
            try {
                await deleteUser(id);
                setAlert({ type: 'success', message: 'User berhasil dihapus' });
                loadUsers();
            } catch (error) {
                setAlert({ type: 'error', message: 'Gagal menghapus user' });
            }
        }
    };

    const openAdd = () => { 
        setFormData(initialForm); 
        setModal({ isOpen: true, isEdit: false, currentId: null }); 
    };

    const openEdit = (u) => { 
        // Saat edit, password dikosongkan (biar tidak ketimpa hash)
        setFormData({ 
            username: u.username, 
            email: u.email, 
            role: u.role, 
            password: '' 
        }); 
        setModal({ isOpen: true, isEdit: true, currentId: u.id }); 
    };

    const closeModal = () => setModal({ ...modal, isOpen: false });
    const closeAlert = () => setAlert(null);

    return { 
        users, alert, modal, formData, 
        handleInputChange, handleSave, handleDelete, 
        openAdd, openEdit, closeModal, closeAlert 
    };
};

export default useUsers;