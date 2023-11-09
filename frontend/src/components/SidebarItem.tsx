import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { expandedCtx } from "./Sidebar";
const SidebarItem = ({
  icon,
  text,
  to,
}: {
  icon: React.ReactElement;
  text: string;
  to: string;
}) => {
  const expanded = React.useContext(expandedCtx);
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname == to;
  return (
    <li
      onClick={() => navigate(to)}
      className={`relative flex ${
        expanded || "justify-center"
      } items-center py-1.5 px-2
       my-1 font-medium rounded-md cursor-pointer
        transition-colors ${
          active
            ? "bg-gradient-to-tr from-button to-light-button text-navbar fill-navbar"
            : "color-white text-white hover:bg-navbar-hover"
        }`}
    >
      {React.cloneElement(icon, {
        className: `w-6 h-6 stroke-${
          active ? "navbar" : "navbar-font"
        } fill-transparent`,
      })}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 pr-3" : "w-0 p-0 h-0"
        }`}
      >
        {text}
      </span>
    </li>
  );
};

export default SidebarItem;
