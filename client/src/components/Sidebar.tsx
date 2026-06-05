import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Stethoscope,
    MessageSquare,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Layers,
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/assets';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import ConfirmationModal from './ConfirmationModal';

interface NavLink {
    href: string;
    label: string;
    icon: React.ElementType;
}

interface SidebarProps {
    role: 'admin' | 'doctor';
    onLogout: () => void;
    onCollapse?: (collapsed: boolean) => void;
}

const adminLinks: NavLink[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/admin/categories', label: 'Categories', icon: Layers }
];

const doctorLinks: NavLink[] = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { href: '/doctor/chat', label: 'Chat', icon: MessageSquare },
];

export const Sidebar = ({ role, onLogout, onCollapse }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();


    const navLinks = role === 'admin' ? adminLinks : doctorLinks;

    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapse?.(newState)
    }

    const isActiveLink = (href: string) => {
        return location.pathname === href;
    };

    return (
        <aside
            className={cn(
                'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Top Part - Logo & App Name */}
            <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                        <img src={Logo} alt="Logo" />
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">
                            BookMyDoc
                        </h1>
                    )}
                </div>
                <Button
                    size="icon"
                    onClick={handleCollapse}
                    className={cn(
                        'flex-shrink-0 h-8 w-8',
                        isCollapsed && 'mx-auto'
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </Button>
            </div>

            {/* Middle Part - Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
                <TooltipProvider>
                    <ul className="space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = isActiveLink(link.href)

                            return (
                                <li key={link.href}>
                                    <Tooltip delayDuration={200}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to={link.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative",
                                                    isActive
                                                        ? "bg-primary text-sidebar-primary-foreground shadow-sm"
                                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                                    isCollapsed && "justify-center"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "flex-shrink-0 w-5 h-5",
                                                        isActive && "text-sidebar-primary-foreground"
                                                    )}
                                                />

                                                {!isCollapsed && (
                                                    <span className="font-medium text-sm whitespace-nowrap">
                                                        {link.label}
                                                    </span>
                                                )}
                                            </Link>
                                        </TooltipTrigger>

                                        {isCollapsed && (
                                            <TooltipContent side="right" align="center">
                                                {link.label}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </li>
                            )
                        })}
                    </ul>
                </TooltipProvider>
            </nav>


            {/* Bottom Part - Dark Mode Toggle & Logout */}
            <TooltipProvider>
                <div className="p-4 border-t border-sidebar-border space-y-2">
                    <div
                        className={cn(
                            "flex items-center gap-2",
                            isCollapsed && "flex-col"
                        )}
                    >
                        {/* Theme toggle */}
                        <div className={cn(isCollapsed && "mx-auto")}>
                            {isCollapsed ? (
                                <Tooltip delayDuration={200}>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <ModeToggle />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        Toggle theme
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <ModeToggle />
                            )}
                        </div>

                        {/* Logout button */}
                        {isCollapsed ? (
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-10 h-10 p-0 justify-center"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="destructive"
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 flex-1"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </Button>
                        )}
                    </div>
                </div>
            </TooltipProvider>


            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={onLogout}
                title='Logout?'
                message='Are you sure you want to logout?'
                confirmText='Yes, Logout'
                cancelText='Cancel'
                confirmButton='destructive'
            />
        </aside>
    );
}