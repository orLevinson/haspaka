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

  const logoutNoToast = useCallback(() => {
    setUserData({});
    localStorage.clear();
    navigate("/login");
  }, []);

  const logout = useCallback(() => {
    logoutNoToast();
    toast.info("התנתקת מהמערכת");
  }, [logoutNoToast]);

  //   auto login if token is ok and auto logout and clear token if expired
  useEffect(() => {
    const wrapper = () => {
      const token = localStorage.getItem("token");
      const tokenExp = localStorage.getItem("tokenExp");

      if (!token || !tokenExp) {
        return logoutNoToast();
      }

      const currentDate = new Date();
      const tokenExpDate = new Date(tokenExp);
      if (currentDate >= tokenExpDate) {
        return logoutNoToast();
      }

      axios
        .get(import.meta.env.VITE_REACT_APP_BASE_URL + "/users/checkToken", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          // auto login message
          toast.success("התחברת אוטומטית למערכת");
          saveUserData({ ...res.data.body, token });
          // when tokenExp ends
          setTimeout(() => {
            // auto logout message
            logout();
          }, tokenExpDate.getTime() - currentDate.getTime());
        })
        .catch(() => logoutNoToast());
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
