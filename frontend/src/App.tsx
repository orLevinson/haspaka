import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "react-query";
import SidebarWithRoutes from "./components/SidebarWithRoutes";
import bg from "./assets/bg.png";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <div
        className="bg-gray-50 w-full h-full flex font-assistant"
        style={{
          backgroundImage: "url(" + bg + ")",
          backgroundPosition: "center",
          backgroundSize: "500px",
          backgroundRepeat: "repeat",
        }}
        dir="rtl"
      >
        <QueryClientProvider client={queryClient}>
          {/* <Navbar /> */}
          <SidebarWithRoutes />
          <div className="w-full h-full font-assistant" dir="rtl">
            <Outlet />
          </div>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
