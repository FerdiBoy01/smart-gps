import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { Plus, Edit, Trash, Package, X, Save, Image as ImageIcon, UploadCloud } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // State Form
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('GPS Tracker');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null); // File yang akan diupload
    const [imagePreview, setImagePreview] = useState(''); // Preview gambar
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setCategory('GPS Tracker');
        setDescription('');
        setImageFile(null);
        setImagePreview('');
        setEditId(null);
    };

    const openAddModal = () => {
        setIsEditing(false);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setIsEditing(true);
        setEditId(product.id);
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setDescription(product.description);
        setImagePreview(product.image); // Tampilkan gambar lama
        setImageFile(null); // Reset file baru
        setIsModalOpen(true);
    };

    // Handle Ganti File Gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Buat preview lokal biar user bisa lihat sebelum upload
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- GUNAKAN FORMDATA UNTUK UPLOAD FILE ---
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('description', description);
        
        // Hanya append jika ada file baru
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (isEditing) {
                await updateProduct(editId, formData);
                setAlert({ type: 'success', message: 'Produk berhasil diperbarui!' });
            } else {
                await createProduct(formData);
                setAlert({ type: 'success', message: 'Produk baru berhasil ditambahkan!' });
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (error) {
            setAlert({ type: 'error', message: 'Gagal menyimpan produk.' });
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            try {
                await deleteProduct(id);
                setAlert({ type: 'success', message: 'Produk dihapus.' });
                loadProducts();
            } catch (error) {
                setAlert({ type: 'error', message: 'Gagal menghapus produk.' });
            }
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="text-blue-600"/> Manajemen Produk
                    </h1>
                    <p className="text-slate-500 text-sm">Kelola katalog produk dengan gambar.</p>
                </div>
                <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition">
                    <Plus size={18} /> Tambah Produk
                </button>
            </div>

            {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

            {/* Table List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Produk</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kategori</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Harga</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-full h-full object-cover"/>
                                            ) : (
                                                <ImageIcon size={20} className="text-slate-400"/>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{item.name}</div>
                                            <div className="text-xs text-slate-500 truncate w-48">{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">{item.category}</span>
                                </td>
                                <td className="p-4 font-bold text-slate-800">{formatRupiah(item.price)}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-800"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            
                            {/* Input Gambar (Preview) */}
                            <div className="flex justify-center mb-4">
                                <div className="relative group w-full h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400">
                                            <UploadCloud size={32} />
                                            <span className="text-xs font-bold mt-2">Klik untuk upload gambar</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Produk</label>
                                <input required type="text" className="w-full border p-2 rounded-lg" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga (Angka)</label>
                                    <input required type="number" className="w-full border p-2 rounded-lg" value={price} onChange={e => setPrice(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori</label>
                                    <select className="w-full border p-2 rounded-lg bg-white" value={category} onChange={e => setCategory(e.target.value)}>
                                        <option>GPS Tracker</option>
                                        <option>Aksesoris</option>
                                        <option>Paket Data</option>
                                        <option>Jasa Pasang</option>
                                        <option>Lainnya</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                                <textarea className="w-full border p-2 rounded-lg h-20 resize-none" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2">
                                <Save size={18}/> {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductPage;