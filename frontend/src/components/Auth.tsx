import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Auth = () => {

    const [jwt, setJwt] = useState('');

    const getToken = () => setJwt(localStorage.getItem('jwt'));

    useEffect(() => {
        getToken();
        window.addEventListener("storage", getToken, false);
        return () => window.removeEventListener('storage', getToken, false);
    }, []);

    return jwt
        ? (
            <span className="flex gap-4">
                <NavLink to="/logout">התנתק</NavLink>
            </span>
        )
        : (
            <span className="flex gap-4">
                <NavLink to="/login">התחברות</NavLink>
                <NavLink to="/register">הרשמה</NavLink>
            </span>
        );
}

export default Auth;