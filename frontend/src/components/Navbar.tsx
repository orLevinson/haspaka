import { NavLink } from "react-router-dom";
import Auth from "./Auth";

const Navbar = () => {
    return (
        <nav className="bg-gray-50 border-gray-200" dir="rtl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span className="self-center text-2xl font-semibold whitespace-nowrap">הספקה</span>
                <Auth />
                <div className="flex gap-8">
                    
                </div>
            </div>
        </nav>
    );
}

export default Navbar;