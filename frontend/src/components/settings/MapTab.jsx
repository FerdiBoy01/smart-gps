const MapTab = ({ settings, setSettings }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-4">Tampilan Peta</h2>
            <div className="space-y-4">
                <div>
                    <label className="font-bold text-slate-700 block mb-2 text-sm">Tema Peta</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Standard', 'Satellite', 'Dark'].map(theme => (
                            <button 
                                key={theme} 
                                onClick={() => setSettings({...settings, theme: theme.toLowerCase()})}
                                className={`p-2 rounded-lg border text-xs font-bold transition-all ${settings.theme === theme.toLowerCase() ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-slate-500'}`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="font-bold text-slate-700 block mb-2 text-sm">Warna Marker</label>
                    <div className="flex gap-3">
                        {['blue', 'red', 'green', 'purple', 'orange'].map(color => (
                            <button 
                                key={color} 
                                onClick={() => setSettings({...settings, markerColor: color})}
                                className={`w-8 h-8 rounded-full border-2 ${settings.markerColor === color ? 'border-slate-800 scale-110' : 'border-transparent'} shadow-sm`} 
                                style={{ backgroundColor: color }} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapTab;