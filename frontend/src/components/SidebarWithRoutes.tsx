import { useContext } from "react";
import { UserCtx } from "../shared/userCtx";
import Bookmark from "./icons/Bookmark";
import BuildingStoreFront from "./icons/BuildingStoreFront";
import ClipboardDocument from "./icons/ClipboardDocument";
import ClipboardDocumentList from "./icons/ClipboardDocumentList";
import CubeTransparent from "./icons/CubeTransparent";
import InboxStack from "./icons/InboxStack";
import ListBullet from "./icons/ListBullet";
import LoginIcon from "./icons/LoginIcon";
import PresentationChart from "./icons/PresentationChart";
import QueueList from "./icons/QueueList";
import RegisterIcon from "./icons/RegisterIcon";
import UsersGroup from "./icons/UsersGroup";
import { Sidebar } from "./Sidebar";
import SidebarItem from "./SidebarItem";

const SidebarWithRoutes = () => {
  const { logout, userData } = useContext(UserCtx);
  return (
    <Sidebar userData={userData} logout={logout}>
      {userData.command_name == "מנהלים" && (
        <>
          <hr className="my-2 border-t border-hr" />
          <SidebarItem to="/commands" icon={<ListBullet />} text="פיקודים" />
          <SidebarItem to="/users" icon={<UsersGroup />} text="ניהול משתמשים" />
          <SidebarItem to="/units" icon={<QueueList />} text="אוגדות" />
          <SidebarItem to="/items" icon={<InboxStack />} text="פריטים" />
        </>
      )}
      {!!userData.command_name && (
        <>
          <hr className="my-2 border-t border-hr" />
          <SidebarItem
            to="/idealInventory"
            icon={<ClipboardDocumentList />}
            text="תקן מודל"
          />
          <SidebarItem
            to="/neededInventory"
            icon={<CubeTransparent />}
            text="פערים"
          />
          <SidebarItem
            to="/futureSupplied"
            icon={<ClipboardDocument />}
            text="אושר לניפוק"
          />
        </>
      )}
      {userData.command_name == "מנהלים" && (
        <>
          <hr className="my-2 border-t border-hr" />
          <SidebarItem to="/givenSoFar" icon={<Bookmark />} text="נופק עד כה" />
          <SidebarItem
            to="/marhasInventory"
            icon={<BuildingStoreFront />}
            text='מלאי מרה"ס'
          />
          <SidebarItem
            to="/InventoryTracking"
            icon={<PresentationChart />}
            text="מעקב פערים"
          />
        </>
      )}
      {!userData.command_name && (
        <>
          <hr className="my-2 border-t border-hr" />
          <SidebarItem to="/login" icon={<LoginIcon />} text="התחברות" />
          <SidebarItem to="/register" icon={<RegisterIcon />} text="הרשמה" />
        </>
      )}
    </Sidebar>
  );
};

export default SidebarWithRoutes;
