import { useState, useEffect } from 'react';
import { getMyDevices, pairDevice, unpairDevice } from '../services/deviceService';

const useMyDevices = () => {
    const [devices, setDevices] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ deviceId: '', pairingCode: '', name: '' });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadDevices(); }, []);

    const loadDevices = async () => {
        setLoading(true);
        try {
            const data = await getMyDevices();
            setDevices(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePair = async (e) => {
        e.preventDefault();
        setAlert(null);
        try {
            await pairDevice(formData);
            setAlert({ type: 'success', message: 'Hore! Device berhasil ditambahkan.' });
            setModalOpen(false);
            setFormData({ deviceId: '', pairingCode: '', name: '' }); // Reset form
            loadDevices();
        } catch (error) {
            setAlert({ type: 'error', message: error.response?.data?.message || 'Gagal pairing. Cek ID & Kode.' });
        }
    };

    const handleUnpair = async (id) => {
        if(confirm('Yakin ingin menghapus device ini dari akunmu?')) {
            try {
                await unpairDevice(id);
                loadDevices();
                setAlert({ type: 'success', message: 'Device dihapus.' });
            } catch (error) {
                setAlert({ type: 'error', message: 'Gagal menghapus device.' });
            }
        }
    };

    const closeAlert = () => setAlert(null);

    return {
        devices, isModalOpen, formData, alert, loading,
        setModalOpen, closeAlert, handleInputChange, handlePair, handleUnpair
    };
};

export default useMyDevices;