import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        if (user?.role === 'admin') return <Navigate to="/admin" replace />;
        if (user?.role === 'subadmin') return <Navigate to="/subadmin" replace />;
        if (user?.role === 'owner') return <Navigate to="/owner/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
