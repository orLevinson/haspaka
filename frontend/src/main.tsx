import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Units from './pages/Units.tsx';
import Commands from './pages/Commands.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Logout from './pages/Logout.tsx';
import Items from './pages/Items.tsx';
import IdealInventory from './pages/IdealInventory.tsx';
import FutureSupplied from './pages/FutureSupplied.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/items",
        element: <Items />
      },
      {
        path: "/idealInventory",
        element: <IdealInventory />
      },
      {
        path: "/futureSupplied",
        element: <FutureSupplied />
      },
      {
        path: "/units",
        element: <Units />
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
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
