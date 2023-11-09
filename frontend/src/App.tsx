import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "react-query";
import SidebarWithRoutes from "./components/SidebarWithRoutes";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <div className="bg-gray-50 w-full h-full flex font-assistant" dir="rtl">
        <QueryClientProvider client={queryClient}>
          {/* <Navbar /> */}
          <SidebarWithRoutes />
          <div className="bg-gray-50 w-full h-full font-assistant" dir="rtl">
            <Outlet />
          </div>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
