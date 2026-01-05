import { useState, useEffect } from 'react';
import { getAllDevices, createDevice, resetDevice, updateSimInfo } from '../services/deviceService';

const useAdminDevices = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [deviceIdInput, setDeviceIdInput] = useState('');

    useEffect(() => { loadDevices(); }, []);

    const loadDevices = async () => {
        setLoading(true);
        try {
            const data = await getAllDevices();
            setDevices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createDevice({ deviceId: deviceIdInput });
            setAlert({ type: 'success', message: 'Device baru berhasil dibuat!' });
            setModalOpen(false);
            setDeviceIdInput('');
            loadDevices();
        } catch (error) {
            setAlert({ type: 'error', message: error.response?.data?.message || 'Gagal membuat device' });
        }
    };

    const handleReset = async (id) => {
        if (confirm('Reset akan memutuskan koneksi user saat ini. Lanjutkan?')) {
            try {
                const res = await resetDevice(id);
                setAlert({ type: 'success', message: `Reset Berhasil! Kode Baru: ${res.newCode}` });
                loadDevices();
            } catch (error) {
                setAlert({ type: 'error', message: 'Gagal reset device' });
            }
        }
    };

    // --- BAGIAN INI YANG KEMUNGKINAN SALAH SEBELUMNYA ---
    const handleUpdateSim = async (id, data) => { // <--- Pastikan ada (id, data)
        try {
            await updateSimInfo(id, data); // <--- Pastikan data dikirim ke service
            setAlert({ type: 'success', message: 'Data SIM berhasil disimpan!' });
            loadDevices(); // Refresh tabel agar data baru muncul
        } catch (error) {
            console.error(error);
            setAlert({ type: 'error', message: 'Gagal update SIM' });
        }
    };

    return {
        devices, loading, alert, isModalOpen, deviceIdInput,
        setDeviceIdInput, setModalOpen, setAlert,
        handleCreate, handleReset, handleUpdateSim // <--- Jangan lupa di-return
    };
};

export default useAdminDevices;