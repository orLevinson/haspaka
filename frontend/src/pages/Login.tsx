import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useCheckPermission from "../shared/useCheckPermission";
import { UserCtx } from "../shared/userCtx";

const Login = () => {
  // localStorage.setItem('jwt', 'abcde');
  // window.dispatchEvent(new Event('storage'));
  // return <Navigate to='/units' />

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { saveUserData } = React.useContext(UserCtx);
  useCheckPermission({ permission: "guests" });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(import.meta.env.VITE_REACT_APP_BASE_URL + "/users/login", {
        username,
        password,
      })
      .then((res) => {
        saveUserData(res.data.body);
        if (!res.data.body.command_id) {
          toast.info("המשתמש עדיין לא אושר על ידי מנהל מערכת");
        } else {
          toast.success("התחברת בהצלחה");
        }
      })
      .catch((err) => {
        let toast_msg = "";
        switch (err.response.status) {
          case 422:
            toast_msg = "אנא הזן שם משתמש וסיסמא תקינים";
            break;
          case 409:
          case 401:
            toast_msg = "שם משתמש או סיסמא שגויים";
            break;
          default:
            toast_msg = "חלה שגיאה במהלך ההתחברות, אנא נסה שנית מאוחר יותר";
            break;
        }
        toast.error(toast_msg);
      });
  };

  return (
    <section className="h-full" dir="rtl">
      <div className="flex flex-col items-center justify-center px-6 mx-auto h-full lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-lg  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              התחברות למערכת
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit}
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  שם משתמש
                </label>
                <input
                  value={username}
                  onChange={handleUsernameChange}
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                  placeholder="לדוג' יוסי123"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  סיסמה
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-teal-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                התחברות
              </button>
              <p className="text-sm font-light text-gray-500">
                אין עדיין משתמש?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline"
                >
                  הרשמה
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
