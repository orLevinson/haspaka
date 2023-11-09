import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Auth = () => {
  return (
    <span className="flex gap-4">
      <NavLink to="/logout">התנתק</NavLink>
      <NavLink to="/login">התחברות</NavLink>
      <NavLink to="/register">הרשמה</NavLink>
    </span>
  );
};

export default Auth;
