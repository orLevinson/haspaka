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
import Logout from "./pages/Logout";
import Items from "./pages/Items";
import IdealInventory from "./pages/IdealInventory";
import FutureSupplied from "./pages/FutureSupplied";
import GivenSoFar from "./pages/GivenSoFar";
import NeededInventory from "./pages/NeededInventory";
import MarhasInventory from "./pages/MarhasInventory";
import { UserDataCtxProvider } from "./shared/userCtx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/items",
        element: <Items />,
      },
      {
        path: "/marhasInventory",
        element: <MarhasInventory />,
      },
      {
        path: "/givenSoFar",
        element: <GivenSoFar />,
      },
      {
        path: "/idealInventory",
        element: <IdealInventory />,
      },
      {
        path: "/neededInventory",
        element: <NeededInventory />,
      },
      {
        path: "/futureSupplied",
        element: <FutureSupplied />,
      },
      {
        path: "/units",
        element: <Units />,
      },
      {
        path: "/commands",
        element: <Commands />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
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
