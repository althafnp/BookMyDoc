import { Sidebar } from '@/components/Sidebar'
import { logout } from '@/features/auth/api/authApi';
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const DoctorLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async() => {
        await logout();
        navigate('/doctor/auth/login', { replace: true })
    }

  return (
    <div className='min-h-screen flex bg-background'>
        <aside className='fixed top-0 left-0 h-full z-10'>
            <Sidebar
                role='doctor'
                onCollapse={setIsCollapsed}
                onLogout={handleLogout}
            />
        </aside>

        <main className={`min-h-screen overflow-auto transition-all duration-300 ${isCollapsed ? 'ml-20': 'ml-64'}`}>
            <Outlet />
        </main>

    </div>
  )
}

export default DoctorLayout