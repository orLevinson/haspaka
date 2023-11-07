import { Navigate } from "react-router";

const Register = () => {

    localStorage.setItem('jwt', 'abcde');
    window.dispatchEvent(new Event('storage'));

    return <Navigate to='/units' />
}

export default Register;