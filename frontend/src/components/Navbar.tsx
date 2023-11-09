import { NavLink } from "react-router-dom";
import Auth from "./Auth";

const Navbar = () => {
    return (
        <nav className="bg-gray-50 border-gray-200" dir="rtl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span className="self-center text-2xl font-semibold whitespace-nowrap">הספקה</span>
                <Auth />
                <div className="flex gap-8">
                    <NavLink to="/commands" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 ">פיקודים</NavLink>
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">אוגדות</NavLink>
                    <NavLink to="/items" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">פריטים</NavLink>
                    <NavLink to="/idealInventory" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">תקן מודל</NavLink>
                    <NavLink to="/neededInventory" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">פערים</NavLink>
                    <NavLink to="/futureSupplied" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">אושר לניפוק</NavLink>
                    <NavLink to="/givenSoFar" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">נופק עד כה</NavLink>
                    <NavLink to="/marhasInventory" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">מלאי מרה"ס</NavLink>
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  ">מעקב פערים</NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;