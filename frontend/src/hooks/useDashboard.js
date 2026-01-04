import { useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../services/authService';

const useDashboard = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logoutUser();
    };

    return { user, handleLogout };
};

export default useDashboard;