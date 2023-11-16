import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "react-query";
import SidebarWithRoutes from "./components/SidebarWithRoutes";
import bg from "./assets/bg.png";
import { UserDataCtxProvider } from "./shared/userCtx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const queryClient = new QueryClient();

  return (
    <UserDataCtxProvider>
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
          <div className="w-full h-full font-assistant overflow-y-auto pb-12" dir="rtl">
            <Suspense fallback={<LoadingOverlay />}>
              <Outlet />
            </Suspense>
          </div>
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </QueryClientProvider>
      </div>
    </UserDataCtxProvider>
  );
}

export default App;
