import { useState } from "react"
import { User, Calendar, Wallet, Lock, Menu, X, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "appointments", label: "Appointments", icon: Calendar, path: "/appointments" },
    { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet" },
    { id: "change-password", label: "Change Password", icon: Lock, path: "/change-password" },
]



const ProfileLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth();

    const activeItem = navItems.find(n => n.path === location.pathname) ?? navItems[0]

    const handleNav = (path: string) => {
        navigate(path)
        setSidebarOpen(false)
    }

    const SidebarNav = () => (
        <nav className="flex flex-col gap-1 p-3">
            {navItems.map(({ id, label, icon: Icon, path }) => {
                const isActive = location.pathname === path
                return (
                    <button
                        key={id}
                        onClick={() => handleNav(path)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
                            ${isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <Icon size={16} className="shrink-0" />
                        <span className="flex-1">{label}</span>
                        {isActive && <ChevronRight size={14} className="opacity-70" />}
                    </button>
                )
            })}
        </nav>
    )

    return (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-4 min-h-[82vh]">

                {/* Desktop Sidebar */}
                <aside className="hidden md:flex flex-col w-56 shrink-0">
                    <Card className="sticky top-8 h-full overflow-hidden">
                        <div className="px-4 pt-5 pb-2 border-b border-border">
                            <div className="flex flex-col items-center gap-2 pb-2">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary"
                                    />
                                ) : (
                                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-primary">
                                        <User className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-35">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <SidebarNav />
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">

                    {/* Mobile top bar */}
                    <div className="flex md:hidden items-center justify-between mb-5">
                        <p className="text-xs text-muted-foreground">{activeItem.label}</p>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
                        >
                            <Menu size={16} />
                            <span>Menu</span>
                        </button>
                    </div>

                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-72 z-50 bg-background border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out md:hidden
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                    <span className="font-semibold text-foreground">Account</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-3 pt-4 pb-3 border-b border-border mx-3 mb-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm select-none">
                            {user?.name?.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <SidebarNav />
            </div>
        </div>
    )
}

export default ProfileLayout