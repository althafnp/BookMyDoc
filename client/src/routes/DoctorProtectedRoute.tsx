import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';
import { roleBasePath } from './UserProtectedRoute';
import AppLoader from '@/components/AppLoader';

const DoctorProtectedRoute = () => {
    const { isAuthenticated, role, initialized } = useAuth();

    if(!initialized) return <AppLoader />;

    if(!isAuthenticated) return <Navigate to={'/doctor/auth/login'} replace />;

    if(role !== 'DOCTOR') {
        return <Navigate to={roleBasePath[role!]} replace />
    }

    return <Outlet />;
}

export default DoctorProtectedRoute