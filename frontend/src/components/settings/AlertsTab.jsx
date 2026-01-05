const AlertsTab = ({ settings, setSettings }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4">Notifikasi</h2>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-orange-800 text-sm">Alert Kuota Habis</span>
                    <input type="checkbox" className="w-5 h-5 accent-orange-600" checked={true} readOnly/>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-700">
                    <span>Batas:</span>
                    <input 
                        type="number" 
                        value={settings.lowQuotaThreshold} 
                        onChange={(e) => setSettings({...settings, lowQuotaThreshold: e.target.value})} 
                        className="w-16 p-1 border rounded text-center bg-white" 
                    />
                    <span className="font-bold">MB</span>
                </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-xl bg-white">
                <div>
                    <p className="font-bold text-slate-700 text-sm">Device Offline</p>
                    <p className="text-xs text-slate-400">Notif jika mati  lebih 1 jam</p>
                </div>
                <input 
                    type="checkbox" 
                    checked={settings.offlineAlert} 
                    onChange={() => setSettings({...settings, offlineAlert: !settings.offlineAlert})} 
                    className="w-5 h-5 accent-blue-600"
                />
            </div>
        </div>
    );
};

export default AlertsTab;