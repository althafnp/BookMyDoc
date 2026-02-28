import Login from '@/features/auth/pages/Login'
import Signup from '@/features/auth/pages/Signup'
import VerifyEmail from '@/features/auth/pages/VerifyEmail'
import AuthLayout from '@/layouts/AuthLayout'
import UserLayout from '@/layouts/UserLayout'
import HomePage from '@/pages/Home'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public routes */}
            <Route path='/' element={<UserLayout />} >
                <Route index element={<HomePage />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path='/auth/signup' element={<Signup />} />
                <Route path='/auth/verify-email/:token' element={<VerifyEmail />} />
                <Route path='/auth/login' element={<Login />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes