import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const user = userStorage?.user;

    // Jika belum login, lempar ke login
    if (!userStorage) {
        return <Navigate to="/login" replace />;
    }

    // Jika login tapi bukan admin, lempar ke dashboard user biasa
    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Jika aman, izinkan masuk
    return <Outlet />;
};

export default AdminRoute;