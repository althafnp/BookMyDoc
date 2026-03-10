import Login from '@/features/auth/pages/Login'
import Signup from '@/features/auth/pages/Signup'
import VerifyEmail from '@/features/auth/pages/VerifyEmail'
import AuthLayout from '@/layouts/AuthLayout'
import UserLayout from '@/layouts/UserLayout'
import HomePage from '@/pages/Home'
import { Route, Routes } from 'react-router-dom'
import UserProtectedRoute from './UserProtectedRoute'
import AllDoctors from '@/features/user/pages/AllDoctors'
import LoginAdmin from '@/features/auth/pages/LoginAdmin'
import LoginDoctor from '@/features/auth/pages/LoginDoctor'
import AdminProtectedRoute from './AdminProtectedRoute'
import AdminLayout from '@/layouts/AdminLayout'
import DoctorProtectedRoute from './DoctorProtectedRoute'
import DoctorLayout from '@/layouts/DoctorLayout'
import ForgotDoctorPassword from '@/features/auth/pages/ForgotDoctorPassword'
import ResetDoctorPassword from '@/features/auth/pages/ResetDoctorPassword'
import GuestRoutes from './GuestRoutes'

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public routes */}
            <Route path='/' element={<UserLayout />} >
                <Route index element={<HomePage />} />
            </Route>

            {/* User protected routes */}
            <Route element={<UserProtectedRoute />}>
                <Route element={<UserLayout />}>
                    <Route path='/doctors' element={<AllDoctors />} />
                </Route>
            </Route>

            {/* Auth Routes */}
            <Route element={<GuestRoutes />}>
                <Route element={<AuthLayout />}>
                    <Route path='/auth/signup' element={<Signup />} />
                    <Route path='/auth/verify-email/:token' element={<VerifyEmail />} />
                    <Route path='/auth/login' element={<Login />} />

                    <Route path='/admin/auth/login' element={<LoginAdmin />} />

                    <Route path='/doctor/auth/login' element={<LoginDoctor />} />
                    <Route path='/doctor/auth/forgot-password' element={<ForgotDoctorPassword />} />
                    <Route path='/doctor/auth/reset-password/:token' element={<ResetDoctorPassword />} />
                </Route>
            </Route>


            {/* Admin routes */}
            <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path='/admin/dashboard' element={<div>admin</div>} />
                    {/* <Route path='/admin/categories' element={<CategoriesPage />} />
                    <Route path='/admin/doctors' element={<DoctorsPage />} />
                    <Route path='/admin/users' element={<UsersPage />} /> */}
                </Route>
            </Route>


            {/* Doctor routes */}
            <Route element={<DoctorProtectedRoute />}>
                <Route element={<DoctorLayout />}>
                    <Route path='/doctor/dashboard' element={<div>doctor</div>} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes