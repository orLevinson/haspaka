import { Navigate } from "react-router";

const Login = () => {

    localStorage.setItem('jwt', 'abcde');
    window.dispatchEvent(new Event('storage'));

    return <Navigate to='/units' />
}

export default Login;