import { Logo } from "@/assets";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-muted px-4">
            {/* Logo */}
            <div className="flex justify-center mt-8 mb-6 sm:mt-10 sm:mb-8">
                <div className="flex items-center space-x-2">
                    <Link to={'/'}>
                        <img
                            src={Logo}
                            alt="BookMyDoc logo"
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                        />
                    </Link>
                    
                    <span className="font-bold text-primary text-lg sm:text-xl md:text-2xl">
                        BookMyDoc
                    </span>
                </div>
            </div>


            <main className="flex flex-1 items-center justify-center w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
