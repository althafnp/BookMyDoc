import AppLoader from '@/components/AppLoader';
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';
import { roleBasePath } from './UserProtectedRoute';

const AdminProtectedRoute = () => {
    const { isAuthenticated, role, initialized } = useAuth();

    if(!initialized) return <AppLoader />;

    if(!isAuthenticated) return <Navigate to={'/admin/auth/login'} replace />;

    if(role !== 'ADMIN') {
        return <Navigate to={roleBasePath[role!]} replace />
    }

    return <Outlet />;
}

export default AdminProtectedRoute