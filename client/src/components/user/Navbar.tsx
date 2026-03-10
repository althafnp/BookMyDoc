import { useState } from 'react';
import { Menu, X, User, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {Logo} from '../../assets/index'
import { Button } from '../ui/button';
// import NotificationModal from './Notification';
import { ModeToggle } from '../mode-toggle';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/features/auth/api/authApi';
import ConfirmationModal from '../ConfirmationModal';
import { toast } from 'sonner';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, role } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);


    const navigate = useNavigate()
    const location = useLocation();

    console.log(isAuthenticated, 'did')

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Doctors', path: '/doctors' },
    ];

    const logoutFunc = async () => {
        await logout();
        toast.success('Logged out')
        navigate('/auth/login', { replace: true })
    };

  return (
    <>
      {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
            
                    {/* Left side - Logo + Project name */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <img src={Logo} />
                        </div>    
                        <span className="text-xl font-bold text-primary">
                            BookMyDoc
                        </span>
                    </div>

                    {/* Center - Navigation links (Desktop only) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return(
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`font-medium transition-colors duration-200 relative group ${isActive ? 'text-primary' : 'hover:text-primary text-foreground'} `}
                                >
                                    {link.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'group-hover:w-full'}`}></span>
                                </Link>
                            )
                            
                        })}
                    </div>

                    {/* Right side - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
              
                        {/* Theme Toggle */}
                        <ModeToggle />
                        

                        {/* Authentication Section */}
                        {isAuthenticated && role === 'USER' ? (
                            <div className='flex space-x-4 items-center'>
                                <div className='relative'>
                                    {/* Notification */}
                                    <button
                                        onClick={() => setIsNotificationModalOpen(true)}
                                        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                        aria-label="Toggle theme"
                                    >   
                                        <Bell className="w-5 h-5 text-primary" />
                                    </button>

                                    {/* Notification count badge */}
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 text-xs flex items-center justify-center bg-primary text-white rounded-full">
                                            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                                        </span>
                                    )}
                                </div>
                                

                                <div className="relative group">
                                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                                        {
                                            user?.profileImage ? (
                                                <img
                                                    src={user?.profileImage}
                                                    alt={user?.name}
                                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-primary">
                                                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                                </div>
                                            )
                                        }
                                        
                                    </button>
                            
                                    {/* Profile Dropdown (simplified for demo) */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="py-2">
                                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsModalOpen(true)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={() => navigate('/auth/login')}>Signup</Button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-primary" />
                            ) : (
                                <Menu className="w-6 h-6 text-primary" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            
                    {/* Mobile Navigation Links */}
                    <div className="space-y-3 mb-4">    
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return(
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block py-2 font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'hover:text-primary dark:text-white'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                            
                        })}
                    </div >

                    {/* Mobile Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        
                        {/* Theme Toggle */}
                        <ModeToggle />

                        {/* Mobile Authentication */}
                        {isAuthenticated && role === 'USER' ? (
                            <>
                                <div className='relative'>
                                    {/* Notification */}
                                    <button
                                        onClick={() => setIsNotificationModalOpen(true)}
                                        className="flex items-center space-x-2 p-2 rounded-lg  hover:text-gray-900 dark:text-white dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                    >
                                        <Bell className="w-5 h-5 text-primary" />
                                        <span className="text-sm">Notifications</span>
                                    </button>

                                    {/* Notification count badge */}
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 text-xs flex items-center justify-center bg-primary text-white rounded-full">
                                            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3">
                                    {
                                        user?.profileImage ? (
                                            <img
                                                src={user?.profileImage}
                                                alt={user?.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-primary">
                                                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            </div>
                                        )
                                    }
                                    
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                            
                        ) : (
                            <Button onClick={() => navigate('/auth/login')}>Signup</Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={logoutFunc}
            title='Logout?'
            message='Are you sure you want to logout?'
            confirmText='Yes, Logout'
            cancelText='Cancel'
            confirmButton='destructive'
        />

        {/* <NotificationModal
            isOpen={isNotificationModalOpen} 
            onClose={() => setIsNotificationModalOpen(false)} 
            setUnreadNotificationsCount={setUnreadNotificationsCount}
       /> */}
    </>
)};

export default Navbar;