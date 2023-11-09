// @ts-ignore
import React from "react";
// @ts-ignore
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Units from "./pages/Units";
import Commands from "./pages/Commands";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Items from "./pages/Items";
import IdealInventory from "./pages/IdealInventory";
import FutureSupplied from "./pages/FutureSupplied";
import GivenSoFar from "./pages/GivenSoFar";
import NeededInventory from "./pages/NeededInventory";
import MarhasInventory from "./pages/MarhasInventory";
import { UserDataCtxProvider } from "./shared/userCtx";


const router = createBrowserRouter([
  {
    id:"דף הבית",
    path: "/",
    element: <App />,
    children: [
      {
        id:"פריטים",
        path: "/items",
        element: <Items />,
      },
      {
        id:'מלאי מרה"ס',
        path: "/marhasInventory",
        element: <MarhasInventory />,
      },
      {
        id:"נופק עד כה",
        path: "/givenSoFar",
        element: <GivenSoFar />,
      },
      {
        id:"תקן מודל",
        path: "/idealInventory",
        element: <IdealInventory />,
      },
      {
        id:"פערי יחידות",
        path: "/neededInventory",
        element: <NeededInventory />,
      },
      {
        id:"אושר לניפוק",
        path: "/futureSupplied",
        element: <FutureSupplied />,
      },
      {
        id:"אוגדות",
        path: "/units",
        element: <Units />,
      },
      {
        id:"פיקודים",
        path: "/commands",
        element: <Commands />,
      },
      {
        id:"התחברות",
        path: "/login",
        element: <Login />,
      },
      {
        id:"הרשמה",
        path: "/register",
        element: <Register />,
      },
      // {
      //   path: "/logout",
      //   element: <Logout />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserDataCtxProvider>
      <RouterProvider router={router} />
    </UserDataCtxProvider>
  </React.StrictMode>
);
