import AppLoader from '@/components/AppLoader';
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import { roleBasePath } from './UserProtectedRoute';

const GuestRoutes = () => {
    const { isAuthenticated, role, initialized } = useAuth();

    if(!initialized) return <AppLoader />;

    if(isAuthenticated) {
        return <Navigate to={roleBasePath[role!]} replace />
    }
  return <Outlet />
}

export default GuestRoutes