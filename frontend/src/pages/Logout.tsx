import { Navigate } from "react-router";

const Logout = () => {

    localStorage.removeItem('jwt');
    window.dispatchEvent(new Event('storage'));

    return <Navigate to='/units' />
}

export default Logout;