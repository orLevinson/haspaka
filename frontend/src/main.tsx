// @ts-ignore
import React from "react";
// @ts-ignore
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const Units = React.lazy(() => import("./pages/Units"));
const Commands = React.lazy(() => import("./pages/Commands"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Items = React.lazy(() => import("./pages/Items"));
const IdealInventory = React.lazy(() => import("./pages/IdealInventory"));
const FutureSupplied = React.lazy(() => import("./pages/FutureSupplied"));
const GivenSoFar = React.lazy(() => import("./pages/GivenSoFar"));
const NeededInventory = React.lazy(() => import("./pages/NeededInventory"));
const MarhasInventory = React.lazy(() => import("./pages/MarhasInventory"));
const Users = React.lazy(() => import("./pages/Users"));
const InventoryTracking = React.lazy(() => import("./pages/InventoryTracking"));

const router = createBrowserRouter([
  {
    id: "דף הבית",
    path: "/",
    element: <App />,
    children: [
      {
        id: "מעקב פערים",
        path: "/InventoryTracking",
        element: <InventoryTracking />,
      },
      {
        id: "ניהול משתמשים",
        path: "/users",
        element: <Users />,
      },
      {
        id: "פריטים",
        path: "/items",
        element: <Items />,
      },
      {
        id: 'מלאי מרה"ס',
        path: "/marhasInventory",
        element: <MarhasInventory />,
      },
      {
        id: "נופק עד כה",
        path: "/givenSoFar",
        element: <GivenSoFar />,
      },
      {
        id: "תקן מודל",
        path: "/idealInventory",
        element: <IdealInventory />,
      },
      {
        id: "פערי יחידות",
        path: "/neededInventory",
        element: <NeededInventory />,
      },
      {
        id: "אושר לניפוק",
        path: "/futureSupplied",
        element: <FutureSupplied />,
      },
      {
        id: "אוגדות",
        path: "/units",
        element: <Units />,
      },
      {
        id: "פיקודים",
        path: "/commands",
        element: <Commands />,
      },
      {
        id: "התחברות",
        path: "/login",
        element: <Login />,
      },
      {
        id: "הרשמה",
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
