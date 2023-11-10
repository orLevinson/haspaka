// react imports
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
// library imports
import axios from "axios";
// types imports
import { userData, userDataCtx } from "../types/userData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserCtx = createContext<userDataCtx>({
  logout: () => {},
  saveUserData: (_) => {},
  userData: {},
});

const UserDataCtxProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<userData>({});
  const navigate = useNavigate();

  const saveUserData = useCallback(
    (data: userData) => {
      setUserData((prev) => ({ ...prev, ...data }));
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "tokenExp",
          new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        );
      }
    },
    [setUserData]
  );

  const logout = useCallback(() => {
    setUserData({});
    localStorage.clear();
    navigate("/login");
    toast.info("התנתקת מהמערכת");
  }, []);

  //   auto login if token is ok and auto logout and clear token if expired
  useEffect(() => {
    const wrapper = () => {
      const token = localStorage.getItem("token");
      const tokenExp = localStorage.getItem("tokenExp");

      if (!token || !tokenExp) {
        return logout();
      }

      const currentDate = new Date();
      const tokenExpDate = new Date(tokenExp);
      if (currentDate >= tokenExpDate) {
        return logout();
      }

      axios
        .get(import.meta.env.VITE_REACT_APP_BASE_URL + "/users/checkToken", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          // auto login message
          saveUserData({ ...res.data.body, token });
          // when tokenExp ends
          setTimeout(() => {
            // auto logout message
            logout();
          }, tokenExpDate.getTime() - currentDate.getTime());
        })
        .catch((_err) => logout());
    };
    wrapper();
  }, [saveUserData, logout]);

  return (
    <UserCtx.Provider
      value={{
        logout,
        userData,
        saveUserData,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export { UserCtx, UserDataCtxProvider };
