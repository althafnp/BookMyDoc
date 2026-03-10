
import Footer from '@/components/user/Footer'
import Navbar from '@/components/user/Navbar'
import { Outlet } from 'react-router-dom'


const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">

            <Navbar />

            <main className='flex-1 w-full'>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default UserLayout