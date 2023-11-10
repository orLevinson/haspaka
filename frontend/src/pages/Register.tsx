import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useCheckPermission from "../shared/useCheckPermission";
import { UserCtx } from "../shared/userCtx";

const Register = () => {
  // localStorage.setItem('jwt', 'abcde');
  // window.dispatchEvent(new Event('storage'));
  // return <Navigate to='/units' />
  const { saveUserData } = useContext(UserCtx);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  useCheckPermission({ permission: "guests" });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(import.meta.env.VITE_REACT_APP_BASE_URL + "/users/register", {
        name,
        username,
        password,
      })
      .then((res) => {
        saveUserData(res.data.body);
        toast.success("נרשמת בהצלחה למערכת, אנא המתן לאישור מנהלי מערכת");
      })
      .catch((err) => {
        let toast_msg = "";
        switch (err.response.status) {
          case 422:
            toast_msg = "אנא הזן שם משתמש, שם מלא וסיסמא תקינים";
            break;
          case 409:
            toast_msg = "שם משתמש קיים במערכת";
            break;
          default:
            toast_msg = "חלה שגיאה במהלך ההרשמה, אנא נסה שנית מאוחר יותר";
            break;
        }
        toast.error(toast_msg);
      });
  };

  return (
    <section className="h-full" dir="rtl">
      <div className="flex flex-col items-center justify-center px-6 mx-auto h-full lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              הרשמה למערכת
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  שם
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="לדוג' יוסי כהן"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
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
                  className="block mb-2 text-sm font-medium text-gray-900 "
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-teal-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                הרשמה
              </button>
              <p className="text-sm font-light text-gray-500 ">
                יש לך משתמש?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline"
                >
                  התחברות
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
