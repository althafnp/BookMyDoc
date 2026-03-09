import { Sidebar } from '@/components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '@/features/auth/api/authApi'

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    
    const navigate = useNavigate();

    const handleLogout = async() => {
        await logout();
        navigate('/admin/auth/login', { replace: true })
    }
  return (
    <div className='min-h-screen flex bg-background'>
        <aside className='fixed top-0 left-0 h-full z-10'>
            <Sidebar
                role='admin'
                onCollapse={setIsCollapsed}
                onLogout={handleLogout}
            />
        </aside>

        <main className={`min-h-screen w-full overflow-auto transition-all duration-300 ${isCollapsed ? 'ml-20': 'ml-64'}`}>
            <Outlet />
        </main>

    </div>
  )
}

export default AdminLayout