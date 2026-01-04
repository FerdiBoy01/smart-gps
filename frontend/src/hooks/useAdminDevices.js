import { useState, useEffect } from 'react';
import { getAllDevices, createDevice, resetDevice } from '../services/deviceService';

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
            setDeviceIdInput(''); // Reset input
            loadDevices();
        } catch (error) {
            setAlert({ type: 'error', message: error.response?.data?.message || 'Gagal membuat device' });
        }
    };

    const handleReset = async (id) => {
        if (confirm('Reset akan memutuskan koneksi user saat ini dan membuat kode pairing baru. Lanjutkan?')) {
            try {
                const res = await resetDevice(id);
                setAlert({ type: 'success', message: `Reset Berhasil! Kode Baru: ${res.newCode}` });
                loadDevices();
            } catch (error) {
                setAlert({ type: 'error', message: 'Gagal reset device' });
            }
        }
    };

    return {
        devices, loading, alert, isModalOpen, deviceIdInput,
        setDeviceIdInput, setModalOpen, setAlert,
        handleCreate, handleReset
    };
};

export default useAdminDevices;