import { NavLink } from "react-router-dom";
import Auth from "./Auth";

const Navbar = () => {
    return (
        <nav class="bg-white border-gray-200 dark:bg-gray-900" dir="rtl">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">הספקה</span>
                <Auth />
                <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div class="flex gap-8">
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white">פריטים</NavLink>
                    <NavLink to="/commands" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white">פיקודים</NavLink>
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white">תקן מודל</NavLink>
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white">אושר לניפוק</NavLink>
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white">כמות שנופקה עד כה</NavLink>
                    <NavLink to="/units" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white">מלאי מרה"ס</NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;