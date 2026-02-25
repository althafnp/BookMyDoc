import Signup from '@/features/auth/pages/Signup'
import AuthLayout from '@/layouts/AuthLayout'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
    return (
        <Routes>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path='/auth/signup' element={<Signup />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes