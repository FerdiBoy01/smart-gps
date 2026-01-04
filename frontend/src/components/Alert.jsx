import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700';
    const Icon = type === 'success' ? CheckCircle : XCircle;

    return (
        <div className={`w-full max-w-md mb-4 flex items-center p-4 border-l-4 rounded-r shadow-sm ${bgColor} animate-fade-in-down`}>
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="text-sm font-medium flex-1">{message}</div>
            <button onClick={onClose} className="ml-2 hover:opacity-70 p-1">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Alert;