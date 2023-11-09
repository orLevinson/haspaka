import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import { userData } from "../types/userData";
import VerticalEllipsis from "./icons/VerticalEllipsis";

const expandedCtx = createContext<boolean>(false);

const Sidebar = ({
  children,
  userData,
  logout,
}: {
  children: ReactNode;
  userData: userData;
  logout: () => void;
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen">
      <nav
        className="h-full flex flex-col border-l bg-navbar shadow-sm overflow-hidden"
        onMouseLeave={() => setExpanded(false)}
        onMouseEnter={() => setExpanded(true)}
      >
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-60 px-16" : "w-14"
            }`}
            alt=""
          />
        </div>
        <expandedCtx.Provider value={expanded}>
          <ul className="flex-1 px-3">{children}</ul>
        </expandedCtx.Provider>
        {!!userData.command_name && !!userData.name && (
          <div
            className={`flex p-2 pr-4 py-4 justify-between items-center transition-all ${
              expanded ? "translate-x-0" : "translate-x-72 w-0"
            }`}
          >
            {/* user avatar */}
            <div className="p rounded-lg">
              <img src={user} className="h-10 w-11 invert" />
            </div>
            <div className="flex flex-col justify-center items-start w-52 pr-5">
              <div className="leading-4"></div>
              <h4 className="font-semibold text-lg text-navbar-font">
                {userData.name}
              </h4>
              <span className="text-sm text-navbar-font">
                {userData.command_name}
              </span>
            </div>
            <div
              className="group relative flex flex-column-reverse justify-center"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <span className="absolute bottom-11 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                התנתקות
              </span>
              <VerticalEllipsis className="w-10 pl-2 cursor-pointer stroke-navbar-font" />
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export { Sidebar, expandedCtx };
