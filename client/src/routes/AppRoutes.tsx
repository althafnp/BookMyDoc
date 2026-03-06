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
            <Route element={<AuthLayout />}>
                <Route path='/auth/signup' element={<Signup />} />
                <Route path='/auth/verify-email/:token' element={<VerifyEmail />} />
                <Route path='/auth/login' element={<Login />} />

                <Route path='/admin/auth/login' element={<LoginAdmin /> } />
            </Route>
        </Routes>
    )
}

export default AppRoutes