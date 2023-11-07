import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'

function App() {

  return (
    <div className='w-full h-full flex flex-col'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
