import AppLoader from "@/components/AppLoader";
import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom";

export const roleBasePath: Record<string, string> = {
    USER: '/',
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
};

const UserProtectedRoute = () => {
    const { isAuthenticated, role, initialized} = useAuth();

    if(!initialized) return <AppLoader />;

    if(!isAuthenticated) {
        return <Navigate to='/auth/login' replace />
    };

    if(role !== 'USER') {
        return <Navigate to={roleBasePath[role!]} replace />
    };

    return <Outlet />
}


export default UserProtectedRoute;