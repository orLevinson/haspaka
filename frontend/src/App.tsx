import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'
import { QueryClient, QueryClientProvider } from "react-query";

function App() {

  const queryClient = new QueryClient();

  return (
    <div className='bg-gray-50 w-full h-full flex flex-col'>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Outlet />
      </QueryClientProvider>
    </div>
  )
}

export default App
